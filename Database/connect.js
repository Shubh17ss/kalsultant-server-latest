const {Client} =require('pg');


const pool=new Client({
    connectionString:`postgres://pqlardcvmbatih:de68ede205b67cfd1b1e63e8552bb4a3182722b674962c4b45bb1521ee8ac96e@ec2-35-169-11-108.compute-1.amazonaws.com:5432/d2snae5i64dusi`,
    ssl: {
      rejectUnauthorized: false
    }
})

pool.connect();




module.exports=pool;
