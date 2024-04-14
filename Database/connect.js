const {Client} =require('pg');

const dotenv = require('dotenv');
dotenv.config();


const pool=new Client({
    connectionString:`${process.env.DATABASE_URL}`,
    ssl: {
      rejectUnauthorized: false
    }
})

pool.connect();




module.exports=pool;
