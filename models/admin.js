const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
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
  is_admin: {
      type: Boolean,
      default: true
  },
  created_at: {
    type: String,
    required: true,
    max: 1000
  },
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
