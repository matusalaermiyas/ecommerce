const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
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
  }
});

const Delivery = mongoose.model("delivery", schema);

module.exports = Delivery;
