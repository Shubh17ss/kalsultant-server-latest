// const Pool=require('pg').Pool;

const {Client} =require('pg');


const pool=new Client({
    connectionString: 'postgres://skwqjesusstowr:81973c569ca3c31b782dd2a1fdcc8a8a2b2d13ec2e78fdd6a0d6da7b3f7fdbca@ec2-44-214-132-149.compute-1.amazonaws.com:5432/d921f2bqtvp1jk',
    ssl: {
      rejectUnauthorized: false
    }
})

pool.connect();




module.exports=pool;
