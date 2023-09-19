/** @module user */
/** Create model for user */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  password: String,
  assignedData: [{ type: Schema.Types.ObjectId, ref: 'data' }]
});

module.exports = mongoose.model('user', UserSchema);
