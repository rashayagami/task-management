import connectSQLite from 'connect-sqlite3'
import session from 'express-session'
import compression from 'compression'
import bodyParser from 'body-parser'
import cors from 'cors'
import express,{ Application } from 'express';
import passport from '../providers/Passport.js';
import path from 'path';

const SQLiteStore = connectSQLite(session)

class Http {
	public static load(application: Application): Application {
		application.use(express.static(path.join(path.resolve(), '../../public')));
		application.use(bodyParser.json({
			limit: process.env.MAX_UPLOAD_LIMIT
		}));

		application.use(bodyParser.urlencoded({
			parameterLimit: parseInt(process.env.APP_MAX_PARAMETER_LIMIT),
			extended: false
        }));
        
		application.disable('x-powered-by');

		
		application.use(session({
			resave:false,
			store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
			secret: 'keyboard cat',
			saveUninitialized: false,
            cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
          }));


		application.use(cors());
        application.use(compression({ filter: (req, res) =>req.headers['x-no-compression']? false: compression.filter(req, res)} ));

		return application;
	}
}

export default Http;