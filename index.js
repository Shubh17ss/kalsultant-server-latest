const express = require('express');
const app = express();
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



//code to render the react build folder
app.use(express.static(path.join(__dirname, "./build")));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
})





