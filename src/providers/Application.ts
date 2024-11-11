import e from 'express';
import dotenv  from 'dotenv';
import Http from '../middlewares/Http.js';
import { CacheProgram } from './Cache.js';
import logger from 'node-color-log';
import { router } from './Routes.js';
import { Documentation } from './Documentation.js';
import { Socket } from 'dgram';

export class Application {

    private application: e.Application

    constructor () {
        this.application = e();
    }

    private loadRoutes() {
        this.application.use(router)
    }

    private loadMiddlewares() {
        Http.load(this.application)
    }

    private loadEnvironment(): void {
        dotenv.config();
    }
    
    private loadDatabaseConnection() { 
        /* Database initialization is not required as connection at a query execution time */
    }
    private loadSwaggerDocumentation() { 
        Documentation.load(this.application)
    }
    private async loadCacheCapability() { 
        await CacheProgram.load()
    }

    private async bootUp() {
        this.loadEnvironment();
        this.loadDatabaseConnection()
		
        this.loadMiddlewares();
        this.loadSwaggerDocumentation()
        this.loadRoutes();
        this.loadCacheCapability();

    }

    public start() { 

        this.bootUp().then(v => {
            
            const port: number = parseFloat(process.env.PORT || '3001');
            
            const server = this.application.listen(port, () => {
                logger.success(`Server :: Running @ 'http://localhost:${port}'`);
            }).on('error', (error) => {
                console.log('Error: ', error.message);
            });
            server.on("connection", (socket: Socket) => {
                console.log("connection",socket.address())
            })

            process.on('SIGTERM', () => {
                logger.debug('SIGTERM signal received: closing HTTP server')
                server.close(() => {
                  logger.debug('HTTP server closed')
                })
            })

        }).catch(e => {
            logger.error("Application boot-up failed!", e.message)
        })
    
    }
}