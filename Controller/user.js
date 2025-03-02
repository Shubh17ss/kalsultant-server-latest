const { sendUserQueryToAdmin } = require("../services/EmailServices/sendEmail");

const recordUserQuery = (req, res) => {
    let { email, message } = req.body;
    let obj = {
        email: email,
        message: message
    }
    sendUserQueryToAdmin(obj);
    res.status(200).json({message:'Response recorded'})
}

module.exports = {
    recordUserQuery
}