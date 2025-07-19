const mongoose = require('mongoose');

const slotsSchema = new mongoose.Schema({
    date: { type: String, required: true },
    slot: { type: String, required: true },
    booked: { type: Boolean, required: true, default: false }
})

const Slots=mongoose.model('Slots',slotsSchema);
module.exports=Slots;