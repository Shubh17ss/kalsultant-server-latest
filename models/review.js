const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    text: { type: String, required: true, maxLength: 150 }
});

const Reviews = mongoose.model('Reviews',reviewSchema);
module.exports = Reviews;