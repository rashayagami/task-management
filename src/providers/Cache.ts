import { createClient, RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "redis"
import logger from 'node-color-log';
import { sha1 } from "object-hash"

export class CacheProgram {
    private static endpoint: string;
    private static client: any;

    public static async load() {
        this.endpoint = process.env.REDIS_URL
        this.client = createClient({ url: this.endpoint }).on("error", (e) => {
            logger.info("CacheProgram", "could not created redis client.");
            logger.error("Error", e.message, "\n");
        });

        try {
            await this.client.connect()
            logger.info("Redis client", "connection successful!")
        } catch (error) {
            logger.info("Redis client", "connection failed!", error.message)
        }
    }

    private static getKey(request) {
        const hashedRequest = sha1({
            query: request.query,
            body: request.body,
        })
        return "request.path}" + "@" + hashedRequest
    }

    private static async write(key, data, options) {
        if (!!this.client?.isOpen) {
            try {
                await this.client.set(key, data, options);
            } catch (error) {
                logger.error("CacheProgram experienced error", error.message,"Failed to cache for key = ", key, )
            }
        } else {
            logger.warn("CacheProgram, failed to cache for key", key)
        }
    }

    private static async read(key) {
        let cachedValue = undefined;

        if (!!this.client?.isOpen) {
            cachedValue = await this.client.get(key);
            if (cachedValue) {
                return cachedValue;
            }
        } else {
            logger.warn("CacheProgram, failed to read key",key)
        }

    }

    public static cache() {
        return this.middleware
    }

    private static async middleware(request, response, next) {
        const options = {
            EX: parseInt(process.env.CACHE_EXPIRE_TIME)
        }

        if (!!this.client?.isOpen) {
            const key = this.getKey(request);
            const cachedValue = await this.read(key);
            if (cachedValue) {

                try {
                    return response.json(JSON.parse(cachedValue));
                } catch {
                    return response.send(cachedValue);
                }

            } else {

                const originalSend = response.send;
                response.send = function cacheResponse(data) {
                    response.send = originalSend
                    if (response.statusCode.toString().startsWith("2")) {
                        this.write(key, data, options).then();
                    }
                    return response.send(data)
                }

            }
            next();
        } else {
            next()
        }
    }

}