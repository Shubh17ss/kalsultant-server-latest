const { sendUserQueryToAdmin } = require("../services/EmailServices/sendEmail");
const pool = require('../Database/connect');

const recordUserQuery = (req, res) => {
    let { email, message } = req.body;
    let obj = {
        email: email,
        message: message
    }
    sendUserQueryToAdmin(obj);
    res.status(200).json({ message: 'Response recorded' })
}

const storeReview = (req, res) => {
    try {
        const { name, email, text } = req.body;
        pool.query("INSERT INTO REVIEWS (name,email,text) VALUES($1,$2,$3)", [name, email, text], (error, result) => {
            if (error) {
                throw new Error(error);
            }
            else {
                res.status(200).json({ message: 'Thank you for your feedback.' })
            }
        })

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