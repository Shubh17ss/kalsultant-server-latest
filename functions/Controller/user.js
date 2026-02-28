const { sendUserQueryToAdmin } = require("../services/EmailServices/sendEmail");
const Reviews = require('../models/review');
const connectDB = require("../mongoDB/db");
const { insertUserQueryEmailIntoSheetsHandler } = require("../services/dataReplicationGS/storeDataInGoogleSheet");

const recordUserQuery = async (req, res) => {
    let conn = await connectDB();
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
        let conn = await connectDB();
        const { name, email, text } = req.body;
        const reviews = new Reviews({
            name, email, text
        });
        const savedReview = await reviews.save();
        res.status(200).json({ message: 'Thank you for your feedback' });
    } catch (error) {
        //logging purpose
        console.log(error);
        res.status(400).json({ error: error.message })

    }
}

const getUsersReviews = async (req, res) => {
    try {
        let conn = await connectDB();
        const reviews = await Reviews.find({}, 'text').limit(10);
        res.status(200).json({ data: reviews });
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Could not fetch reviews" });
    }
}
const insertUserQueryEmailIntoSheets = async (req, res) => {
    try {
        console.log("Request body for recording email in sheets");
        const result = await insertUserQueryEmailIntoSheetsHandler(req.body);
        if (result) {
            res.status(200).json({ message: "Email recorded in sheets" });
        }
        else {
            throw new Error("Failed to record email in sheets");
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: "Could not record email in sheets" });
        return;
    }
}

module.exports = {
    recordUserQuery,
    storeReview,
    getUsersReviews,
    insertUserQueryEmailIntoSheets
}