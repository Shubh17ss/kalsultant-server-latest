const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { send } = require('process');

const sessionCreatedNotifyAdmin = (obj) => {
    let { name, email, date, slot } = obj;
    let authData = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        debug: true,
        auth: {
            user: process.env.KALSULTANT_EMAIL,
            pass: process.env.KALSULTANT_PASSWORD,
        },
    })
    let message = `Please go to calendar for kalsultant.com and add the user's email id to attendees. Scheduled Date:${date} Slot:${slot}`
    authData.sendMail({
        from: `kalsultant@gmail.com`,
        to: ['shubhsteam1701@gmail.com', 'kartiksharma13571@gmail.com'],
        subject: `${name} with email id: ${email} has scheduled a session.`,
        text: message
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    })
    return;
}

const sessionScheduledEmailToUser = (obj) => {
    try {
        let { name, email, date, slot, sessionId } = obj;
        let templatePath = path.join(__dirname, "", "email-template.html");
        let htmlTemplate = fs.readFileSync(templatePath, "utf8");

        htmlTemplate = htmlTemplate
            .replace("{{name}}", name)
            .replace("{{date}}", date)
            .replace("{{slot}}", slot)
            .replace("{{image_url}}", "cid:sessionImage")
            .replace("{{sessionId}}", sessionId);

        let imagePath = path.join(__dirname, "", "email_body_bg.webp");

        let authData = nodemailer.createTransport({
            host: "smtp.gmail.com",
            secure: true,
            port: 465,
            debug: true,
            auth: {
                user: process.env.KALSULTANT_EMAIL,
                pass: process.env.KALSULTANT_PASSWORD,
            },
        })
        authData.sendMail({
            from: `kalsultant@gmail.com`,
            to: [email],
            subject: `Session successfully scheduled !!!`,
            html: htmlTemplate,
            attachments: [
                {
                    filename: "session-image.webp",
                    path: imagePath,
                    cid: "sessionImage"
                }
            ]
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        })
    }
    catch (error) {
        console.log(error);
    }
    return;
}

const sendUserQueryToAdmin = (obj) => {
    let { email, message } = obj;
    let authData = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        debug: true,
        auth: {
            user: process.env.KALSULTANT_EMAIL,
            pass: process.env.KALSULTANT_PASSWORD,
        },
    })
    authData.sendMail({
        from: `kalsultant@gmail.com`,
        to: ['kalsultant@gmail.com'],
        cc: ['shubhsteam1701@gmail.com', 'kartiksharma13571@gmail.com'],
        subject: `User query with ${email} has reached out`,
        text: message
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    })
    return;
}

const sendEmailNotificationOnProposedSlot = (obj) => {
    let { name, email, date, slot } = obj;
    let authData = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        debug: true,
        auth: {
            user: process.env.KALSULTANT_EMAIL,
            pass: process.env.KALSULTANT_PASSWORD,
        },
    })
    let message = `Hi ${name}, you have requested for a custom slot with us.\nWe hope to get back with positive response. \nDetails: Date : ${date} Slot: ${slot}.\n\n Regards,\n Team KalSultant`
    authData.sendMail({
        from: `kalsultant@gmail.com`,
        to: email,
        cc: ['shubhsteam1701@gmail.com', 'kartiksharma13571@gmail.com'],
        subject: `Thank you ${name} for choosing Kalsultant`,
        text: message
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    })
    return;
}

module.exports = {
    sessionCreatedNotifyAdmin,
    sessionScheduledEmailToUser,
    sendUserQueryToAdmin,
    sendEmailNotificationOnProposedSlot
}