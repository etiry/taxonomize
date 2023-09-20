const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// Create local strategy
const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    // Verify this email and password, call done with the user
    // if it is the correct email and password
    // otherwise, call done with false
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false);
      }

      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Tell passport to use this strategy
// passport.use(jwtLogin);
passport.use('local', localLogin);

module.exports = passport;
