import { Application } from 'express';
import passport from 'passport';

class Passport {
	public bootUp (application: Application): Application {
		application = application.use(passport.initialize());
		application = application.use(passport.session());

		passport.serializeUser<any, any>(function(user, cb){
			process.nextTick(function() {
                cb(null, { id: user.id, username: user.username, name: user.name });
            });
		});

		passport.deserializeUser<any, any>(function(user, cb) {
            process.nextTick(function() {
              return cb(null, user);
            });
        });

		this.loadStrategies();

		return application;
	}

	private loadStrategies(): void {
		try {

        } catch (error) {
            
		}
	}

	public isAuthenticated (req, res, next): any {
		if (req.isAuthenticated()) {
			return next();
		}

		req.flash('errors', { msg: 'Please Log-In to access any further!'});
		return res.redirect('/login');
	}

	public isAuthorized (req, res, next): any {
        /* const provider = req.path.split('/').slice(-1)[0];
            const token = req.user.tokens.find(token => token.kind === provider);
		    if (token) {
                return next();
		    } else {
		    	return res.redirect(`/auth/${provider}`);
		    }
        */
	}
}

export default new Passport;