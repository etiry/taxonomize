/** @module category */
/** Create model for category */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: String
});

module.exports = mongoose.model('category', CategorySchema);
