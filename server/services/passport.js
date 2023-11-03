const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { pool } = require('../dbHandler');
const keys = require('../config/keys');
const { validPassword } = require('../util/auth.js');

// Create local strategy
const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    // Verify this email and password, call done with the user
    // if it is the correct email and password
    // otherwise, call done with false
    try {
      const data = await pool.query('SELECT * FROM users WHERE email=$1', [
        email
      ]);

      if (data.rowCount === 0) {
        return done(null, false);
      }

      if (!validPassword(password, data.rows[0].salt, data.rows[0].hash)) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, data.rows[0]);
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
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [
      payload.sub
    ]);

    if (user) {
      done(null, user.rows[0]);
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
