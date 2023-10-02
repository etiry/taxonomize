const jwt = require('jwt-simple');
const keys = require('../config/dev');
const { pool } = require('../dbHandler');
const { setPassword } = require('../util/auth.js');

const tokenForUser = (userId) =>
  jwt.encode(
    {
      sub: userId,
      iat: Math.round(Date.now() / 1000),
      exp: Math.round(Date.now() / 1000 + 5 * 60 * 60)
    },
    keys.TOKEN_SECRET
  );

exports.signin = async (req, res, next) => {
  const user = await pool.query('SELECT id, email FROM users WHERE id = $1', [
    req.user.id
  ]);

  console.log(user);

  res.send({
    id: req.user.id,
    token: tokenForUser(req.user.id),
    email: user.rows[0].email
  });
};

exports.currentUser = (req, res) => {
  const user = {
    email: req.user.email,
    token: tokenForUser(req.user)
  };

  res.send(user);
};

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'You must provide email and password' });
  }

  // See if a user with the given email exists
  try {
    const existingUser = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );

    // If a user with email does exist, return an error
    if (existingUser.rowCount !== 0) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const { salt, hash } = setPassword(password);
    const user = await pool.query(
      'INSERT INTO users (email, salt, hash) VALUES ($1, $2, $3) RETURNING *',
      [email, salt, hash]
    );

    // Respond to request indicating the user was created
    res.status(200).json({
      id: `${user.rows[0].id}`,
      token: tokenForUser(`${user.rows[0].id}`),
      email
    });
  } catch (error) {
    return next(error);
  }
};
