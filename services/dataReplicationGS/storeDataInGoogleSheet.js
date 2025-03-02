import { google } from 'googleapis';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();



const sheets = google.sheets('v4');
const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);
const SERVICE_ACCOUNT_FILE_PATH = join(__dirname, 'authFiles', 'sa-kalsultant-google-sheets.json');
const SPREADSHEET_ID = `${process.env.GOOGLE_SHEET_ID}`;

//authenticate using a service account
async function authenticate() {
    const auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    return auth.getClient();
}

export const insertBookedSessionDataIntoSheets = async (obj) => {
    const { sessionId, email, firstName, lastName, gender, dob, tob, pob, date, slot, contactNumber } = obj;
    let name = firstName + ' ' + lastName;

    try {
        //initialize auth
        const auth = await authenticate();
        // Get the last row number
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `BookedSessions!A1:A1000`, // Check the first column for existing data
            auth,
        });
        const numRows = response.data.values ? response.data.values.length : 0;
        // Define the new data to insert
        const sessionData = [[sessionId, email, contactNumber, name, gender, dob, tob, pob, date, slot, "Unpaid", "", "Scheduled"]];
        // Insert the data into the next available row
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `BookedSessions!A${numRows + 1}:M${numRows + 1}`,
            valueInputOption: 'RAW',
            auth,
            requestBody: {
                values: sessionData,
            },
        });
    }
    catch (err) {
        throw new Error(err);
    }
}
