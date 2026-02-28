const { google } = require('googleapis');
const dotenv = require('dotenv')
dotenv.config({ path: '../../.env' });
const functions = require('firebase-functions');
const { onObjectDeleted } = require('firebase-functions/storage');

const sheets = google.sheets('v4');

//authenticate using a service account
async function authenticate() {
    console.log("Raw json", process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    console.log("Parsed json", serviceAccount);
    const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    return auth.getClient();
}
const insertBookedSessionDataIntoSheets = async (obj) => {
    const { _id, email, name, gender, dob, tob, pob, session_date, slot, proposedSlot, contactNumber, status } = obj;
    const sessionId = _id;
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID

    try {
        //initialize auth
        const auth = await authenticate();
        console.log("Authenticated successfully");

        // Get the last row number
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `BookedSessions!A1:A1000`, // Check the first column for existing data
            auth,
        });
        const numRows = response.data.values ? response.data.values.length : 0;
        // Define the new data to insert
        const sessionData = [[sessionId, email, contactNumber, name, gender, dob, tob, pob, session_date, slot, proposedSlot, status, "", "Scheduled"]];
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
const insertUserQueryEmailIntoSheetsHandler = async (obj) => {
    const {email}=obj;
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID

    try {
        //initialize auth
        const auth = await authenticate();
        console.log("Authenticated successfully");

        // Get the last row number
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `Queries!A1:A1000`, // Check the first column for existing data
            auth,
        });
        const numRows = response.data.values ? response.data.values.length : 0;
        // Define the new data to insert
        const sessionData = [[email]];
        // Insert the data into the next available row
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `Queries!A${numRows + 1}:A${numRows + 1}`,
            valueInputOption: 'RAW',
            auth,
            requestBody: {
                values: sessionData,
            },
        });
        return true;
    }
    catch (err) {
        console.log("We have an error");
        console.log(err);
        throw new Error(err);
    }

}

module.exports = {
    insertBookedSessionDataIntoSheets,
    insertUserQueryEmailIntoSheetsHandler
}
