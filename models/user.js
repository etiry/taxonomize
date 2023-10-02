/** @module user */
/** Create model for user */

// const mongoose = require('mongoose');
const crypto = require('crypto');

// const { Schema } = mongoose;

const User = (email, teamId) => {
  const salt = null;
  const hash = null;

  const setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
      .toString('hex');
  };

  const validPassword = function (password) {
    const checkHash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
      .toString('hex');

    return this.hash === checkHash;
  };

  return {
    email,
    salt,
    hash,
    teamId,
    setPassword,
    validPassword
  };
};

module.exports = User;
