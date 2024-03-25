const {Client} =require('pg');


const pool=new Client({
    connectionString:`postgres://vlhiqjgyfalvsv:2cece9e54f669fa0cfa3e87a56b05c18043ba4c0993a424f17c9f648cac458b0@ec2-34-252-169-131.eu-west-1.compute.amazonaws.com:5432/d5gb3m319k0hg`,
    ssl: {
      rejectUnauthorized: false
    }
})

pool.connect();




module.exports=pool;
