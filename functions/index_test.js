const express = require('express');
const { onRequest } = require('firebase-functions/v2/https');
const connectDB = require('./mongoDB/db');

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        // const connection = await connectDB();
        let connection=true;
        if (connection) {
            console.log("Health check ping received.");
            res.status(200).json({ message: "Connection to mongo db" });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

});

// Only export the function — do not call app.listen()
exports.api = onRequest({ cors: true }, app);
