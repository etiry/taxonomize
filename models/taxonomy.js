/** @module taxonomy */
/** Create model for taxonomy */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaxonomySchema = new Schema({
  name: String,
  categories: [{ type: Schema.Types.ObjectId, ref: 'category' }]
});

module.exports = mongoose.model('taxonomy', TaxonomySchema);