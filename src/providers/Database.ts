import { mkdirp } from 'mkdirp';
import sqlite3 from 'sqlite3';


class Database extends sqlite3.Database{ 
    private db: sqlite3.Database
    constructor() { 
        mkdirp.sync('./var/db');
        super('./var/db/todos.db');
        this.bootUp()
    }

    public bootUp() {
        const db = this

     }
}

export const database = new Database();