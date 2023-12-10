const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const userRoutes = require('./Routes/user');
const sessionRoutes = require('./Routes/session');
const slotsRoutes = require('./Routes/slots');
const adminRoutes = require('./Routes/admin');
//for environment variables
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/admin', adminRoutes);


//code to render the react build folder
app.use(express.static(path.join(__dirname, "./build")));

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})





