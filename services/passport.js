const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const keys = require('../config/keys');
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

      return done(null, user._id);
    } catch (error) {
      return done(error);
    }
  }
);

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.TOKEN_SECRET
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  try {
    const user = User.findById(payload.sub);

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

// Tell passport to use this strategy
passport.use('local', localLogin);
passport.use('jwt', jwtLogin);

module.exports = passport;
