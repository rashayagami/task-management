import e from 'express';
import { Locals } from './Local.js';
import { Handler as ExceptionHandler } from '../exceptions/handler.js';
import dotenv  from 'dotenv';
import { Routes } from './Routes.js';

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
        throw new Error('Method not implemented.');
    }

    private loadEnvironment(): void {
        dotenv.config();
    }
    
    private loadDatabaseConnection() { 
        /* Database initialization is not required as connection at a query execution time */
    }

    private bootUp() {
        this.loadEnvironment();
        this.loadDatabaseConnection()
		
        this.loadMiddlewares();
        this.loadRoutes();
    }

    public start() { 
        this.bootUp()
        const port: number = parseFloat(process.env.port);
        this.application.use(ExceptionHandler.logErrors);
		this.application.use(ExceptionHandler.clientErrorHandler);
		this.application.use(ExceptionHandler.errorHandler);
		ExceptionHandler.loadNotFoundHandler(this.application);


		this.application.listen(port, () => {
			return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
		}).on('error', (error) => {
			return console.log('Error: ', error.message);
		});
    }
}