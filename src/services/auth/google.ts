import Strategy from 'passport-google-oidc';
import { database } from '../../providers/Database.js';

export class GoogleStrategy {
    public static load(passport: any) {
        passport.use(new Strategy({
            clientID: process.env['GOOGLE_CLIENT_ID'],
            clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
            callbackURL: '/oauth2/redirect/google',
            scope: ['profile']
        },this.verify))
    }

    private static verify(issuer, profile, cb) {

        database.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
            issuer,
            profile.id
        ], function (err, row:any) {
            if (err) { return cb(err); }
            if (!row) {
                database.run('INSERT INTO users (name) VALUES (?)', [
                    profile.displayName
                ], function (err) {
                    if (err) { return cb(err); }

                    var id = this.lastID;
                    database.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
                        id,
                        issuer,
                        profile.id
                    ], function (err) {
                        if (err) { return cb(err); }
                        var user = {
                            id: id,
                            name: profile.displayName
                        };
                        return cb(null, user);
                    });
                });
            } else {
                database.get('SELECT * FROM users WHERE id = ?', [row.user_id], function (err, row) {
                    if (err) { return cb(err); }
                    if (!row) { return cb(null, false); }
                    return cb(null, row);
                });
            }
        });
    }
}
