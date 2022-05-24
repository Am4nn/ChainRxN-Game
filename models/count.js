const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    count: {
        type: Number
    }
});

module.exports = mongoose.model('Count', counterSchema);