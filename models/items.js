const mongoose = require('mongoose');

const Items = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        max: 2000
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = Items;