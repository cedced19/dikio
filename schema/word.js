var mongoose = require('mongoose');

var wordSchema = mongoose.Schema({
  _id: Number,
  text: { type: String, lowercase: true },
  translations: [{ type: Schema.Types.ObjectId, ref: 'Translation' }]
});

module.exports = mongoose.model('Word', wordSchema);
