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
        const db = this.db
        db.serialize(function() {
          db.run("CREATE TABLE IF NOT EXISTS users ( \
            id INTEGER PRIMARY KEY, \
            username TEXT UNIQUE, \
            hashed_password BLOB, \
            salt BLOB, \
            name TEXT \
          )");
          
          db.run("CREATE TABLE IF NOT EXISTS federated_credentials ( \
            id INTEGER PRIMARY KEY, \
            user_id INTEGER NOT NULL, \
            provider TEXT NOT NULL, \
            subject TEXT NOT NULL, \
            UNIQUE (provider, subject) \
          )");
          
          db.run("CREATE TABLE IF NOT EXISTS todos ( \
            id INTEGER PRIMARY KEY, \
            owner_id INTEGER NOT NULL, \
            title TEXT NOT NULL, \
            completed INTEGER \
          )");
            
        });
     }
}

export const database = new Database();