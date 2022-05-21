const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: 300,
  },
  item_in_stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  delivery_fee: {
    type: Number,
    default: 0
  },
  handling_fee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  tax_1: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true,
    max: 500,
  },
  image: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: {
      values: ["clothes", "cosmetics", "electronics", "shoes"],
      message: "{VALUE} is not supported",
    },
  },
  status: {
    type: String,
    enum: {
      values: ["new", "used"],
      message: "{VALUE} is not supported",
    },
  },
  created_at: {
    type: String,
    required: true,
  },
  inserted_at: {
    type: Date,
    default: Date.now
  }
});

const Products = mongoose.model("product", productsSchema);

module.exports = Products;
