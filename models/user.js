const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  phone: {
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
    type: String,
    default: "https://res.cloudinary.com/buypal/image/upload/v1656936853/ecommerce/output_qo5snz.png"
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
