const fs = require('fs');
const Session = require('../models/session');
const { randomUUID } = require('crypto');
const { google } = require('googleapis');
const { createMeetingInviteUsingSA } = require('../services/scheduleEvent');
const { sessionCreatedNotifyAdmin, sessionScheduledEmailToUser, sendEmailNotificationOnProposedSlot } = require('../services/EmailServices/sendEmail');
const { insertBookedSessionDataIntoSheets } = require('../services/dataReplicationGS/storeDataInGoogleSheet');
const Slots = require('../models/slots');

//SESSION POST METHODS
const createSession = async (req, res) => {
    try {
        let { firstName, lastName, email, dob, tob, gender, pob, date, slot, proposedSlot, contactNumber } = req.body;
        let name = firstName + " " + lastName;
        const session_date = date;
        const sessionAlreadyBooked = await Session.findOne({
            session_date: session_date,
            slot: slot
        });
        if (sessionAlreadyBooked) {
            res.status(400).json({ Message: "Sorry session already booked" });
            return;
        }

        const session = new Session({
            name, email, contactNumber, dob, tob, pob, gender, session_date, slot, proposedSlot
        });
        const saved_session = await session.save();
        await Slots.updateOne(
            { date: session_date, slot: slot },
            { $set: { booked: true } }
        );
        res.status(200).json({ message: "Session saved successfully in mongoDB", data: saved_session });
        
        //services functions
        let obj = {
            sessionId: saved_session._id,
            name: name,
            email: email,
            date: session_date,
            slot: proposedSlot
        };
        await sendEmailNotificationOnProposedSlot(obj);
        await insertBookedSessionDataIntoSheets(saved_session);
        return;
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ error: error.message });
    }
}
const storeProposedSession = async (req, res) => {
    try {
        let { firstName, lastName, email, dob, tob, gender, pob, date, slot, proposedSlot, contactNumber } = req.body;
        let name = firstName + ' ' + lastName;
        const session_date = date;
        const sessionAlreadyProposed = await Session.findOne({
            session_date: session_date,
            proposedSlot: proposedSlot
        });
        if (sessionAlreadyProposed) {
            return res.status(400).json({ message: "Slot already proposed by someone" });
        }
        const session = new Session({
            name, email, contactNumber, dob, tob, pob, gender, session_date, slot, proposedSlot
        });
        const saved_session = await session.save();
        res.status(200).json({ message: "Session saved succesfully", data: saved_session });
        let obj = {
            sessionId: saved_session._id,
            name: name,
            email: email,
            date: session_date,
            slot: proposedSlot
        };
        await sendEmailNotificationOnProposedSlot(obj);
        await insertBookedSessionDataIntoSheets(saved_session);
        return;

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
//SESSION GET METHODS
const getAllSessions = async (req, res) => {
    try {
        let sessions = await Session.find();
        res.status(200).json({ data: sessions });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message })
    }
}
const getUserSessions = async (req, res) => {
    try {
        const { email } = req.body;
        const sessions = await Session.find({
            email: email
        });
        res.status(200).json({ data: sessions })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// BELOW IS GET SESSION BY ID
const getSessionDetails = async (req, res) => {
    const { sessionId } = req.body;
    try {
        const sessionData = await Session.findById({ _id: sessionId });
        res.status(200).json({ data: sessionData });
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}
//SESSION UPDATE METHODS
const updateSessionStatus = async (req, res) => {
    try {
        const { sessionId, status } = req.body;
        const session = await Session.updateOne(
            { _id: sessionId },
            {
                $set: { status: status }
            }
        );
        res.status(200).json({ message: "Record updated successfully", data: session })
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// ------------------------*********************----------------------------------

//api to get booked slots for a given date
const getBookedSLots = (req, res) => {
    const date = req.body.date;
    res.status(200).json({message:'This controller is not build yet'});
    return;
}
// Google linked services
const storeSessionDataInGoogleSheets = async (req, res) => {
    const obj = req.body;
    try {
        await insertBookedSessionDataIntoSheets(obj);
        res.status(200).json({ message: 'Data inserted into google sheet' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Something went wrong' });
    }
}
module.exports = {
    createSession,
    getAllSessions,
    updateSessionStatus,
    getBookedSLots,
    getUserSessions,
    getSessionDetails,
    storeSessionDataInGoogleSheets,
    storeProposedSession
}