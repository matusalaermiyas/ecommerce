const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const schema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        max: 3000
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Rates = mongoose.model('rate', schema)

module.exports = Rates;