const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

/* Passport configuration */
const initialize = (passport) => {
    const authUser = async (email, password, done) => {
        const user = await User.findOne({email: email});
        if (!user) {
            return done(null, false, { message: 'Invalid username or password' });
        }
        // Check user password
        try {
            if (!user.confirmed) {
                // User did not confirmed his email
                return done(null, false, { message: 'Please confirm your email first' });
            }
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user, { message: 'You have been successfully logged in' });
            } else {
                return done(null, false, { message: 'Invalid username or password' });
            }
        } catch (e) {
            done(e);
        }
    };

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, authUser));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        return done(null, user);
    });
};

module.exports = initialize;
