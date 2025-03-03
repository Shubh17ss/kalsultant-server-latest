const fs = require('fs');
const { google } = require('googleapis');

const createMeetingInviteUsingSA = async (obj) => {
    start_time='';
    end_time='';
    let {name, date, slot } = obj;
    let hrs=slot.split('-');
    start_time=hrs[0]+':00',
    end_time=hrs[1]+':00';
    let date_arr=date.split('/');
    date=date_arr[2]+'-'+date_arr[1]+'-'+date_arr[0];
    date = date.trim();
    const event = {
        eventName: `KALSULTANT | Astro Consultancy | ${name}`,
        description: 'Guiding Your Stars, Illuminating Your Path: Your Astrology Journey Begins Here',
        startTime: `${date}T${start_time}`,
        endTime: `${date}T${end_time}`,
        timeZone: 'Asia/Kolkata'
    }
    const scopes = ["https://www.googleapis.com/auth/calendar"];
    const calendarId = "kalsultant@gmail.com";
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    try {

        const jwtClient = new google.auth.JWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key,
            scopes
        );
        await jwtClient.authorize();
        const calendar = google.calendar({ version: "v3", auth: jwtClient });
        const response =  calendar.events.insert({
            calendarId: calendarId,
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
                'conferenceData': {
                    'createRequest': {
                        'requestId': 'readnasdf_12dsaf'
                    }
                }
            }
        });
        console.log(response);
    }
    catch (error) {
        console.log(error);
    }
}

module.exports={createMeetingInviteUsingSA}