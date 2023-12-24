const twilio = require('twilio');

// Twilio credentials
const accountSid = 'AC633f96bcf1d76394ebfa69444736d5ae';
const authToken = '74a3e714a420028ffbcc2179ae0f9f6e';
const twilioPhoneNumber = '+12059646067';


const sendNotification = (req, res) => {
  const client = twilio(accountSid, authToken);
  const toPhoneNumber = '+919068111886';
  const message = 'Thank you for booking a session with Kalsultant.';

  client.messages.create({
    from:twilioPhoneNumber,
    body:message,
    to:toPhoneNumber
  }).then((message)=>{
     res.status(200).send(`Message sent with SID ${message.sid}`)
  }).catch((error)=>{
    res.status(400).send(error)
  }) 
}

module.exports = {
  sendNotification
}