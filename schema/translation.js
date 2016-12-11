var mongoose = require('mongoose');

var translationSchema = mongoose.Schema({
  _creator: { type: Number, ref: 'Word' },
  text: { type: String, lowercase: true },
  plural: { type: String, lowercase: true },
  language: { type: String, lowercase: true }
});

module.exports = mongoose.model('Translation', translationSchema);
