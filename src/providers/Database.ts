import { mkdirp } from 'mkdirp';
import sqlite3 from 'sqlite3';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Files } from '../database/entities/Files.js';

export class Database extends DataSource { 
    private db: DataSource;
    constructor(option: DataSourceOptions) { 
        super(option)
    }

    public static getInstance() { 
        const database = new Database({
            type: 'sqlite',
            database: './database.sqlite',  
            synchronize: true,              
            logging: true,
            entities: [
                Files
            ],
        })
        return database
    }
    
}

