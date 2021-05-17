const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  // name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  // aadhar: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  isVoted: { type: Boolean, default: false },
  roles:[{type: mongoose.Schema.Types.ObjectId,
          ref: "Role"}]

});

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema);
