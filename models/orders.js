const mongoose = require("mongoose");
const Items = require("./items");

const ordersSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
    max: 5000
  },
  delivered: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    max: 5000
  },
  items: {
    type: [Items],
    required: true,
  },
  payed: {
    type: Boolean,
    default: false,
  },
  order_day: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("order", ordersSchema);

module.exports = Order;