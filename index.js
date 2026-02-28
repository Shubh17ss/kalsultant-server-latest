const express = require('express');
const app = express();
const connectDb = require('./mongoDB/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const sessionRoutes = require('./Routes/session');
const slotsRoutes = require('./Routes/slots');
const userRoutes = require('./Routes/user');

//for environment variables
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
  // origin:['http://192.168.1.6:3000','http://localhost:3000']
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/session', sessionRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/user', userRoutes);

const server = app.listen(process.env.PORT, async () => {
  try {
    const connection=await connectDb();
    if(connection==false){
      throw new Error("Error connection to database");
    }
    console.log(`Server started on port ${process.env.PORT}`);
  }
  catch (error) {
    console.log(error);
    process.exit();
  }
})





