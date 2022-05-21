const mongoose = require('mongoose');

module.exports = mongoose.model('error', mongoose.Schema({
    happend_day: {
        type: String,
        required: true,
        max: 5000
    },
    message_was: {
        type: String,
        required: true,
        max: 5000
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}));
