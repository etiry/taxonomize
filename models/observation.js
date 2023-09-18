/** @module observation */
/** Create model for observation */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const ObservationSchema = new Schema({
  text: String,
  category: { type: Schema.Types.ObjectId, ref: 'category' }
});

module.exports = mongoose.model('observation', ObservationSchema);