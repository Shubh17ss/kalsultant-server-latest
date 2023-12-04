const pool = require('../Database/connect');
const { randomUUID } = require('crypto');
const jwt = require('jsonwebtoken');


const validateJWT=(req,res,next)=>{
    console.log('Code came here');
    const {JWT}=req.body;
    if(JWT==null){
        
    }
    let ret=null;
    try{
        ret=jwt.verify(JWT,process.env.JWT_SECRET);
    }
    catch(err){
        res.status(400).json({error:'Token expired'});
        return;
    }
    if(ret==null){
        res.status(400).json({error:'JWT token missing'});
        return; 
    }
    const id=ret.id;
    const arr=id.split(' ');
    pool.query('SELECT * FROM ADMIN WHERE email=$1 and password=$2',[arr[0],arr[1]],(error,results)=>{
        if(error){
            res.status(400).json({error:error.message});
        }
        else
        {
            if(results.rows.length>0){
                next();
            }
            else
            {
                res.status(400).send('Admin not verified');
            }
        }
    })
   
}


const validateAdmin = (req, res) => {
    
    const { email, password } = req.body;
    console.log(email," ",password);
    pool.query('SELECT * FROM admin where email=$1 AND password=$2;', [email, password], (error, result) => {
        if (error) {
            console.log(error.message);
            res.status(400).send(error.message);
        }
        else {
            if (result.rows.length > 0) {
                let id = email + ' ' + password;
                const token = jwt.sign({ id: id, }, process.env.JWT_SECRET, {
                    expiresIn: '10min'
                })
                res.status(200).json({jwt:token});
            }
            else {
                res.status(400).send('Invalid Login');
            }
        }

    })
}





module.exports = {
    validateAdmin,
    validateJWT
}