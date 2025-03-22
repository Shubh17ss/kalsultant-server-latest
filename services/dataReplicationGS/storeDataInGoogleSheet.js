const { google } = require('googleapis');
const dotenv = require('dotenv')
dotenv.config({ path: '../../.env' });

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
const sheets = google.sheets('v4');
const SPREADSHEET_ID = `${process.env.GOOGLE_SHEET_ID}`;

//authenticate using a service account
async function authenticate() {
    const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    return auth.getClient();
}
const insertBookedSessionDataIntoSheets = async (obj) => {
    const { sessionId, email, firstName, lastName, gender, dob, tob, pob, date, slot, proposed_slot, contactNumber } = obj;
    let name = firstName + ' ' + lastName;
    console.log("Inserting session data into google sheet");
    console.log('service account ', serviceAccount);
    try {
        //initialize auth
        const auth = await authenticate();
        console.log("Authenticated successfully");
        console.log(auth);
        // Get the last row number
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `BookedSessions!A1:A1000`, // Check the first column for existing data
            auth,
        });
        const numRows = response.data.values ? response.data.values.length : 0;
        // Define the new data to insert
        const sessionData = [[sessionId, email, contactNumber, name, gender, dob, tob, pob, date, slot, proposed_slot, "Unpaid", "", "Scheduled"]];
        // Insert the data into the next available row
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `BookedSessions!A${numRows + 1}:N${numRows + 1}`,
            valueInputOption: 'RAW',
            auth,
            requestBody: {
                values: sessionData,
            },
        });
    }
    catch (err) {
        console.log("We have an error");
        console.log(err);
        throw new Error(err);
    }
}
module.exports = {
    insertBookedSessionDataIntoSheets
}
