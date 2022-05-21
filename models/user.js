const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    max: 1000,
    unique: true
  },
  password: {
      type: String,
      required: true,
      max: 5000
  },
  username: {
    type: String,
    required: true,
    max: 5000
  },
  profile_picture: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
