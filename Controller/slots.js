const Slots = require('../models/slots');
const Sessions = require('../models/session');

//to be used with proposed slot api
const getSlots = async (req, res) => {
    const { date } = req.body;
    try {
        const count = await Sessions.countDocuments({ session_date: date });
        if (count === 6) {
            res.status(400).json({ message: 'Maximum capacity of 6 slots reached for the day' });
            return;
        }
        const availableSlots = await Slots.find({ date: date, booked: false });
        res.status(200).json({ data: availableSlots });
        return;
    }
    catch (error) {
        res.status(400).json({ error: error });
        return;
    }
}
const addSlot = async (req, res) => {
    try {
        const { date, slot } = req.body;
        const slotAlreadyCreated = await Slots.find({
            $and: [
                { date: date },
                { slot: slot }
            ]
        });
        if (slotAlreadyCreated.length!=0) {
            res.status(300).json({ message: "Slot already created" });
            return;
        }
        const slotMd = new Slots({
            date, slot
        });
        const savedSlot = await slotMd.save();
        res.status(200).json({ message: 'Slot created successfully', data: savedSlot });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
    return;
}

module.exports = {
    getSlots,
    addSlot,
}