const User = require('../models/user');

exports.signin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Denied, redirect to sign in page
    res.redirect('/signin');
  } else {
    res.send('Logged in');
  }
};

exports.currentUser = (req, res) => {
  const user = {
    email: req.user.email
  };

  res.send(user);
};

exports.signup = async (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;

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
    res.send('User created');
  } catch (error) {
    return next(error);
  }
};
