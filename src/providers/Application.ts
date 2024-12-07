import e from 'express';
import dotenv  from 'dotenv';
import Http from '../middlewares/Http.js';
import { CacheProgram } from './Cache.js';
import logger from 'node-color-log';
import { router } from './Routes.js';
import { Documentation } from './Documentation.js';
import { Socket } from 'dgram';
import { DataSource } from 'typeorm';
import { Database } from './Database.js';

export class Application  {

    private application: e.Application
    private database: DataSource

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
    
    private async loadDatabaseConnection() { 
        this.database = Database.getInstance()
        try { 
            await this.database.initialize()
            console.log("Database Initialized",this.database.isInitialized)
            this.application.set("database", this.database);
        } catch (error) { 
            console.log("Database Initialization failed!!", error.message)
            throw error
        }
    }

    private loadSwaggerDocumentation() { 
        Documentation.load(this.application)
    }
    private async loadCacheCapability() { 
        await CacheProgram.load()
    }

    private async bootUp() {
        this.loadEnvironment();
        await this.loadDatabaseConnection()
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

    public getDatabaseConn():DataSource { 
        return this.database
    }
}