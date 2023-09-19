/** @module data */
/** Create model for data */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataSchema = new Schema({
  taxonomy: { type: Schema.Types.ObjectId, ref: 'taxonomy' },
  observations: [{ type: Schema.Types.ObjectId, ref: 'observation' }],
  completed: Boolean
});

module.exports = mongoose.model('data', DataSchema);