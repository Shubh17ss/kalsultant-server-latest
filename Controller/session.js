const fs = require('fs');
const pool = require('../Database/connect');
const { randomUUID } = require('crypto');
const { google } = require('googleapis');
const { createMeetingInviteUsingSA } = require('../services/scheduleEvent');
const { sessionCreatedNotifyAdmin, sessionScheduledEmailToUser, sendEmailNotificationOnProposedSlot } = require('../services/EmailServices/sendEmail');
const { insertTeamDataIntoSheets, insertBookedSessionDataIntoSheets } = require('../services/dataReplicationGS/storeDataInGoogleSheet');
const calendar = google.calendar('v3');

const createSession = (req, res) => {
    let data = req.body;
    const sessionId = randomUUID();
    pool.query('SELECT CURRENT_DATE', (error, results) => {
        if (error) {
            console.log(error.message);
            res.status(400).send(error.message);
        }
        else {

            let creationDate = results.rows[0].current_date;

            pool.query(`INSERT INTO SESSIONS(id,firstname,lastname,email,dob,tob,gender, pob, session_date, session_slot, created_at, status, contact_number) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'unpaid',$12)`,
                [sessionId, data.firstName, data.lastName, data.email, data.dob, data.tob, data.gender, data.pob, data.date, data.slot, creationDate, data.contactNumber], (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(400).json({
                            message: error.message,
                            code: error.code
                        });
                    }
                    else {
                        pool.query('UPDATE SLOTS SET booked = true where date=$1 and slot=$2', [data.date, data.slot], async (error, results) => {
                            if (error) {
                                console.log(error.message);
                                res.status(400).send(error.message);
                            }
                            else {
                                let obj = {
                                    name: data.firstName + ' ' + data.lastName,
                                    email: data.email,
                                    date: data.date,
                                    slot: data.slot
                                };

                                await createMeetingInviteUsingSA(obj);
                                await sessionCreatedNotifyAdmin(obj);
                                obj.sessionId = sessionId;
                                data.sessionId = sessionId;
                                await sessionScheduledEmailToUser(obj);
                                await insertBookedSessionDataIntoSheets(data);
                                res.status(200).json({ success: true, sessionId: sessionId });
                            }
                        })
                    }
                })

        }
    })

}

const getAllSessions = (req, res) => {
    const search = req.query.search;
    if (search.length == 0) {
        pool.query('select * from sessions ORDER BY created_at DESC', (error, results) => {
            if (error) {
                res.status(400).json({ message: 'Internal Server Error' });
            }
            else {
                res.status(200).json({ result: results.rows });
            }
        })
    }
    else {
        pool.query('SELECT * FROM SESSIONS WHERE firstname ~* $1 OR lastname ~* $1 OR email ~* $1  OR session_date ~* $1 order by created_at DESC;', [search], (error, results) => {
            if (error) {
                res.status(400).send('Internal Server Error');
            }
            else {

                res.status(200).json({ result: results.rows })
            }
        })
    }
}

const updateSessionStatus = (req, res) => {
    let { id, status } = req.body;
    pool.query('UPDATE SESSIONS SET STATUS = $1 where id=$2 ', [status, id], (error, results) => {
        if (error) {
            res.status(400).send('Internal Server Error');
        }
        else {
            res.status(200).json({ message: 'Status Updated Successfully' });
        }
    })
}

//api to get booked slots for a given date

const getBookedSLots = (req, res) => {
    const date = req.body.date;
    pool.query('SELECT slot from slots where date=$1 AND booked is null', [date], (error, results) => {
        if (error) {
            res.status(400).send('Internal Server Error');
        }
        else {
            res.status(200).json({ slots: results.rows });
        }
    })
}

const getUserSessions = (req, res) => {
    const userId = req.query.user_id;

    pool.query('SELECT * FROM SESSIONS where user_id=$1 ORDER BY CREATED_AT DESC', [userId], (error, results) => {
        if (error) {
            res.status(400).send(error.message);
        }
        else {
            res.status(200).send(results.rows);
        }
    })
}

const getSessionDetails = (req, res) => {
    const { sessionId } = req.body;
    pool.query('SELECT * FROM sessions where id=$1', [sessionId], (error, results) => {
        if (error) {
            res.status(400).json({ error: error });
        } else {
            res.status(200).json({ data: results.rows })
        }
    })
}

const storeProposedSession = (req, res) => {
    try {
        let data = req.body;
        const sessionId = randomUUID();
        pool.query('SELECT CURRENT_DATE', (error, results) => {
            if (error) {
                console.log(error.message);
                res.status(400).send(error.message);
            }
            else {
                let creationDate = results.rows[0].current_date;
                pool.query(`INSERT INTO SESSIONS(id,firstname,lastname,email,dob,tob,gender, pob, session_date, session_slot,proposed_slot, created_at, status, contact_number) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'unpaid',$13)`,
                    [sessionId, data.firstName, data.lastName, data.email, data.dob, data.tob, data.gender, data.pob, data.date, data.slot, data.proposed_slot, creationDate, data.contactNumber], (error, result) => {
                        if (error) {
                            console.log(error);
                            res.status(400).json({
                                message: error.message,
                                code: error.code
                            });
                        }
                        else {
                            pool.query('UPDATE SLOTS SET booked = true where date=$1 and slot=$2', [data.date, data.slot], async (error, results) => {
                                if (error) {
                                    console.log(error.message);
                                    res.status(400).send(error.message);
                                }
                                else {
                                    let obj = {
                                        name: data.firstName + ' ' + data.lastName,
                                        email: data.email,
                                        date: data.date,
                                        slot: data.proposed_slot
                                    };

                                    obj.sessionId = sessionId;
                                    data.sessionId = sessionId;
                                    await sendEmailNotificationOnProposedSlot(obj);
                                    await insertBookedSessionDataIntoSheets(data);
                                    res.status(200).json({ success: true, sessionId: sessionId });
                                }
                            })
                        }
                    })

            }
        })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
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