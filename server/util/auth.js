const crypto = require('crypto');

const setPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  return { salt, hash };
};

const validPassword = (password, salt, hash) => {
  const checkHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  return hash === checkHash;
};

module.exports = { setPassword, validPassword };
