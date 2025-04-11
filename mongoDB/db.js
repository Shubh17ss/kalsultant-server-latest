const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    const options = {
        useNewUrlParser: true,           // Use new URL parser (removes deprecation warning)
        useUnifiedTopology: true,        // Use new server discovery and monitoring engine
        connectTimeoutMS: 10000,         // Time to wait before connection timeout (in ms)
        socketTimeoutMS: 45000,          // Time to wait before socket timeout (in ms)
        serverSelectionTimeoutMS: 5000,  // Time to wait for server selection (in ms)
        autoIndex: false,                // Disable auto-creation of indexes in production for performance
        maxPoolSize: 10,                 // Maximum number of socket connections in the pool
        minPoolSize: 5,                  // Minimum number of socket connections in the pool
        retryWrites: true,               // Retry write operations on transient network errors
        w: 'majority',                   // Write acknowledgment (ensure write is committed to majority of nodes)
        tls: true,                       // Enable TLS/SSL connection if using MongoDB Atlas or secured connection
        authSource: 'admin',             // Authentication database (optional for Atlas)
    };  
    try {
        const conn = await mongoose.connect('mongodb+srv://kalsultant:Xi3kWqX8yyvpo7cv@clusteritraa1.pxvg0.mongodb.net/kalsultant_db',options)
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = connectDB