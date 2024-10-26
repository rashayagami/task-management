import e from 'express';
import { Handler as ExceptionHandler } from '../exceptions/handler.js';
import dotenv  from 'dotenv';
import { Routes } from './Routes.js';
import Http from '../middlewares/Http.js';
import { CacheProgram } from './Cache.js';
import logger from 'node-color-log';

export class Application {

    private application: e.Application

    constructor () {
        this.application = e();
    }

    private loadRoutes() {
        const routes = new Routes()
        routes.loadApisV1(this.application)
        routes.loadApisV2(this.application)
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
    private async loadCacheCapability() { 
        await CacheProgram.load()
    }

    private async bootUp() {
        this.loadEnvironment();
        this.loadDatabaseConnection()
		
        this.loadMiddlewares();
        this.loadRoutes();
        await this.loadCacheCapability()

    }

    public start() { 

        this.bootUp().then(v => {
            
            const port: number = parseFloat(process.env.port);
            const url: string = process.env.URL;
            
            this.application.listen(port, () => {
                logger.success(`Server :: Running @ '${url}'`);
            }).on('error', (error) => {
                console.log('Error: ', error.message);
            });

        }).catch(e => {
            logger.error("Application boot-up failed!", e.message)
        })
    
    }
}