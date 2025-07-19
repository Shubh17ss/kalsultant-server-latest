const express = require('express');
const connectDb = require('./mongoDB/db');
const cookieParser = require('cookie-parser');
const sessionRoutes = require('./Routes/session');
const slotsRoutes = require('./Routes/slots');
const userRoutes = require('./Routes/user');
const cors = require('cors');
const { defineSecret } = require('firebase-functions/params');

//for environment variables
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/session', sessionRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/user', userRoutes);
app.get('/', async (req, res) => {
    try {
        const connection = await connectDb();
        if (connection == false) {
            throw new Error("Error connection to database");
        }
        res.status(200).json({ message: "Configured" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: "Something went wrong" });
    }
})

//defining the secrets
const mongoURL = defineSecret("MONGO_DB_URL");
const kalSultantEmail = defineSecret("KALSULTANT_EMAIL");
const kalSultantPassword = defineSecret("KALSULTANT_PASSWORD");
const google_service_account = defineSecret("GOOGLE_SERVICE_ACCOUNT_JSON");
const google_sheet_id = defineSecret("GOOGLE_SHEET_ID");

const { onRequest } = require("firebase-functions/v2/https");
exports.api = onRequest({ secrets: [mongoURL, kalSultantEmail, kalSultantPassword, google_service_account, google_sheet_id] }, app);





