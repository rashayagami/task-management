import { mkdirp } from 'mkdirp';
import sqlite3 from 'sqlite3';
import { DataSource, DataSourceOptions } from 'typeorm';


export class Database extends DataSource { 
    private db: DataSource;
    constructor(option: DataSourceOptions) { 
        super(option)
    }

    public static getInstance() { 
        return new Database({
            type: 'sqlite',
            database: './database.sqlite',  
            synchronize: true,              
            logging: true,
            entities: [
                'dist/database/entity/**/*.{js,ts}',
                'src/database/entity/**/*.{js,ts}'
            ],
        });
    }
    
}

