const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { ordersSchema: Order } = require('./orders')

const schema = new Schema({
  delivery: {
    type: mongoose.Types.ObjectId
  },
  delivery_items: [
    {
        delivered: {
            type: Boolean,
            default: false
        },
        order: {
            type: Order
        }
    }
  ]
});

const DeliveryItem = mongoose.model("delivery_item", schema);

module.exports = DeliveryItem;
