const { profileEnd } = require('console');
const pool = require('../Database/connect');
const { randomUUID } = require('crypto');
const { google } = require('googleapis');
const { userInfo } = require('os');
const calendar = google.calendar('v3');

const createSession = (req, res) => {
    const data = req.body;
    const sessionId = randomUUID();
    pool.query('SELECT CURRENT_DATE', (error, results) => {
        if (error) {
            console.log(error.message);
            res.status(400).send(error.message);
        }
        else {

            let creationDate = results.rows[0].current_date;

            pool.query(`INSERT INTO SESSIONS(id,user_id,firstname,lastname,email,dob,tob,gender,city,state,country,session_type,session_date,session_slot,created_at,status,contact_number) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'Scheduled',$16)`,
                [sessionId, data.id, data.firstname, data.lastname, data.email, data.dob, data.tob, data.gender, data.city, data.state, data.country, data.session_type, data.session_date, data.session_slot, creationDate, data.contact_number], (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(400).json({
                            message: error.message
                        });
                    }
                    else {
                        pool.query('UPDATE SLOTS SET booked = true where date=$1 and slot=$2', [data.session_date, data.session_slot], (error, results) => {
                            if (error) {
                                console.log(error.message);
                                res.status(400).send(error.message);
                            }
                            else {
                                res.status(200).json({ success: true, sessionId: sessionId });
                            }
                        })
                    }
                })

        }
    })

}

const createMeetingInvite = (req, res) => {

    let { email, name, date, start_time, end_time } = req.body;
    date = date.trim();




    const event = {
        eventName: `KALSULTANT | Astro Consultancy | ${name}`,
        description: 'Guiding Your Stars, Illuminating Your Path: Your Astrology Journey Begins Here',
        startTime: `${date}T${start_time}`,
        endTime: `${date}T${end_time}`,
        timeZone: 'Asia/Kolkata'
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
    )

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        conferenceDataVersion: 1,
        sendNotifications: true,
        resource: {
            'summary': event.eventName,
            'description': event.description,
            'start': {
                'dateTime': event.startTime,
                'timeZone': 'Asia/Kolkata'
            },
            'end': {
                'dateTime': event.endTime,
                'timeZone': 'Asia/Kolkata'
            },
            'attendees': [{
                'email': `${email}`
            }],
            'conferenceData': {
                'createRequest': {
                    'requestId': 'readnasdf_12dsaf'
                }
            }
        }
    }).then((response) => {
        res.status(200).json({ response: response });
    }).catch((error) => {
        res.status(400).send(error);
    })

}

const setMeetingLink = (req, res) => {
    let { sessionId, url } = req.body;
    pool.query('UPDATE SESSIONS SET invite_link=$1 where id=$2', [url, sessionId], (error, results) => {
        if (error) {
            res.status(400).send('Internal Server Error');
        }
        else {
            res.status(200).json({ message: 'Meeting Url Set' });
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
    const userId=req.query.user_id;
  
    pool.query('SELECT * FROM SESSIONS where user_id=$1 ORDER BY CREATED_AT DESC',[userId],(error,results)=>{
        if(error){
            res.status(400).send(error.message);
        }
        else{
           res.status(200).send(results.rows);
        }
    })
}


module.exports = {
    createSession,
    createMeetingInvite,
    setMeetingLink,
    getAllSessions,
    updateSessionStatus,
    getBookedSLots,
    getUserSessions

}