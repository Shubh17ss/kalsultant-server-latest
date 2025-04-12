const { sendUserQueryToAdmin } = require("../services/EmailServices/sendEmail");
const pool = require('../Database/connect');
const Reviews = require('../models/review');

const recordUserQuery = (req, res) => {
    let { email, message } = req.body;
    let obj = {
        email: email,
        message: message
    }
    sendUserQueryToAdmin(obj);
    res.status(200).json({ message: 'Response recorded' })
}

const storeReview = async (req, res) => {
    try {
        const { name, email, text } = req.body;
        const reviews = new Reviews({
            name, email, text
        });
        const savedReview = await reviews.save();
        res.status(200).json({message:'Thank you for your feedback'});
    } catch (error) {
        //logging purpose
        console.log(error);
        res.status(400).json({ error: error.message })

    }
}

module.exports = {
    recordUserQuery,
    storeReview
}