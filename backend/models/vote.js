const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  voteCount: { type : Number, require: true, default:0}

});

module.exports = mongoose.model('Vote', voteSchema);
