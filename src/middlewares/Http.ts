import connectSQLite from 'connect-sqlite3'
import session from 'express-session'
import compression from 'compression'
import bodyParser from 'body-parser'
import { checkSchema } from 'express-validator';
import cors from 'cors'
import express,{ Application } from 'express';
import Passport from '../providers/Passport.js';
import path from 'path';

const SQLiteStore = connectSQLite(session)

class Http {
	public static load(application: Application): Application {
		application.use(express.static(path.join(__dirname, 'public')));
		application.use(bodyParser.json({
			limit: process.env.maxUploadLimit
		}));

		application.use(bodyParser.urlencoded({
			parameterLimit: parseInt(process.env.maxParameterLimit),
			extended: false
        }));
        
		application.disable('x-powered-by');

		
        application.use(session({
            store: new SQLiteStore,
            secret: 'your secret',
            cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
          }));


		application.use(cors());
        application.use(compression({ filter: (req, res) =>req.headers['x-no-compression']? false: compression.filter(req, res)} ));


		application = Passport.bootUp(application);

		return application;
	}
}

export default Http;