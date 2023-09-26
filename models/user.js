/** @module user */
/** Create model for user */

const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  hash: String,
  salt: String,
  assignedData: [{ type: Schema.Types.ObjectId, ref: 'data' }],
  assignedTaxonomies: [{ type: Schema.Types.ObjectId, ref: 'taxonomy' }]
});

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

UserSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');

  return this.hash === hash;
};

module.exports = mongoose.model('user', UserSchema);
