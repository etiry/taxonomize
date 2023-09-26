const jwt = require('jwt-simple');
const User = require('../models/user');
const keys = require('../config/dev');

const tokenForUser = (user) =>
  jwt.encode(
    {
      sub: user._id,
      iat: Math.round(Date.now() / 1000),
      exp: Math.round(Date.now() / 1000 + 5 * 60 * 60)
    },
    keys.TOKEN_SECRET
  );

exports.signin = async (req, res, next) => {
  const { email } = await User.findOne({ _id: req.user._id });

  res.send({
    id: req.user._id,
    token: tokenForUser(req.user),
    email
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
    const existingUser = await User.findOne({ email });

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User();

    user.email = email;
    user.setPassword(password);

    user.save();

    // Repond to request indicating the user was created
    res.json({ id: user._id, token: tokenForUser(user) });
  } catch (error) {
    return next(error);
  }
};
