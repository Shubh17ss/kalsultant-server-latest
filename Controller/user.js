const pool = require('../Database/connect');
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


const cookie_options = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
}

const getUserData=(req,res)=>{
    console.log('Code came in get userdata function');
    let id=''+req.query.userId;
    id=id.trim();
    console.log(id);
    pool.query('select name,email from users where id=$1',[id],(error,result)=>{
        if(error)
        res.status(400).send(error.message);
        else
        {
            res.status(200).json(result.rows);
        }
    })
}

const getUsers = (req, res) => {
    pool.query('SELECT * FROM USERS', (error, results) => {
        if (error) {

        }
        else {
            res.status(200).json(results.rows);
        }
    })

}

const RegisterUserUsingEmail = async (req, res) => {
    const userId = randomUUID();
    userId.replace(/-/g, '');
    const { name, email, password } = req.body;
    const cryptedPassword = await bcrypt.hash(password, 3);
    const provider = null;
    const verified = false;

    //check if email already exists
    pool.query('SELECT EMAIL FROM USERS WHERE EMAIL=$1', [email], (error, results) => {
        if (error) {
            res.status(404).json({ ErrorMessage: error.message });
        }
        else {
            if (results.rows.length > 0) {
                res.status(404).json({ ErrorMessage: 'User already exists' });
            }
            else {
                pool.query('INSERT INTO USERS(id,name,email,password,provider,verified) VALUES($1,$2,$3,$4,$5,$6) returning id', [userId, name, email, cryptedPassword, provider, verified], (error, results) => {
                    if (error) {
                        console.log(error.message);
                        res.status(400).send('Internal Server Error');
                    }
                    else {
                        sendOTPViaEmail(email,"KALSULTANT - Astro Consultants (Account Verification). Please verify your account","Thank you for choosing KalSultant. Please confirm your email using OTP : ");
                        res.status(200).send('User Registered Successfully..please verify your email');
                    }
                })
            }
        }
    })


}

const signInUser = (req, res) => {
    let { email, password } = req.body;
    pool.query('SELECT * FROM USERS WHERE email=$1 AND verified=$2', [email, true], async (error, results) => {
        if (error) {
            res.status(404).send('Internal Server Error');
        }
        else {
            if (results.rows.length > 0) {
                let passReceived = results.rows[0].password;
                if (await bcrypt.compare(password, passReceived)) {
                    const token = createJWT(results.rows[0].id);
                    res.status(200).cookie("token", token, cookie_options).json({
                        success: true,
                        userId: results.rows[0].id,
                        username: results.rows[0].name,
                        email: results.rows[0].email,
                    });
                }
                else {
                    res.status(400).send('Invalid Password or Email');
                }
            }
            else {
                res.status(400).send('Email either not registered or not verified');
            }
        }
    });
}

const handleProviderAuth = (req, res) => {
    let { name, email, provider } = req.body;
    //check if email exists
    pool.query('SELECT id from users where email=$1 AND provider=$2', [email, provider], (error, results) => {
        if (error) {
            res.status(404).send('Internal Server Error');
        }
        else {
            if (results.rows.length == 0) //email or provider did not match
            {
                pool.query('SELECT * from users where email=$1', [email], (error, results) => {
                    if (error) {
                        res.status(404).send('Internal Server Error');
                    }
                    else {
                        if (results.rows.length == 0) // email not registered
                        {
                            const userId = randomUUID();
                            pool.query('INSERT INTO USERS (id,name,email,provider) VALUES($1,$2,$3,$4)', [userId, name, email, provider], (error, results) => {
                                if (error) {
                                    res.status(400).send(error.message);
                                }
                                else {
                                    const token = createJWT(userId);
                                    res.status(200).cookie("token", token, cookie_options).json({
                                        success: true,
                                        userId: userId,
                                        username: name,
                                        email: email,
                                    })
                                }
                            })
                        }
                        else if (results.rows.length > 0) //wrong provider chosen
                        {
                            const regProvider = results.rows[0].provider;
                            const id = results.rows[0].id
                            if (regProvider == null) {
                                pool.query('UPDATE USERS SET provider=$1 where id=$2', [provider, id], (error, results) => {
                                    if (error) {
                                        res.status(400).send(error.message);
                                    }
                                    else {
                                        const token = createJWT(id);
                                        res.status(200).cookie("token", token, cookie_options).json({
                                            success: true,
                                            userId: id,
                                            username: name,
                                            email: email,
                                        })
                                    }
                                })
                            }
                            else {
                                res.status(400).json({
                                    error: 'Authentication provider not valid for this email'
                                })
                            }

                        }
                    }
                })
            }
            else if (results.rows.length > 0) //user has logged using provider before
            {
                const userId = results.rows[0].id;
                const token = createJWT(userId);
                sendEmailUserLoginNotify(email);
                res.status(200).cookie("token", token, cookie_options).json({
                    success: true,
                    userId: userId,
                    username: name,
                    email: email,
                })
            }
        }
    })
}

const forgotPassword=(req,res)=>{
    let {email}=req.body;
    console.log('Code came here');
    sendOTPViaEmail(email,"KALSULTANT - Astro Consultants (RESET PASSWORD).","Please reset your password using OTP :");
    res.status(200).json({
        message:'Password Reset OTP Sent successfully',
    })
}

const resetPassword=async (req,res)=>{
    let {email, password}=req.body;
    const cryptedPassword = await bcrypt.hash(password, 3);
    pool.query('UPDATE users set password=$1 where email=$2',[cryptedPassword,email],(error,results)=>{
        if(error){
            res.status(400).send('Internal Server Error');
        }
        else
        {
            res.status(200).json({success:true, message:'Password reset successfull'});
        }
    })
}   

//verify OTP for email verification
const verifyOTPForEmail = (req, res) => {
    const { otp } = req.body;
    pool.query('SELECT * from users where otp=$1', [otp], (error, results) => {
        if (error) {
            res.status(404).send('Internal Server Error');
        }
        else {
            if (results.rows.length > 0) {
                const id = results.rows[0].id;
                pool.query('UPDATE USERS SET VERIFIED=$1 WHERE id=$2', [true, id], (error, results) => {
                    if (error) console.log(error.message);
                    else
                        console.log(results);
                })
                res.status(200).send('OTP Verified');
            }
            else {
                res.status(400).send('Invalid OTP');
            }
        }
    })
}


//Send confirmation email to verify the email address
const sendOTPViaEmail = (email,subject, text) => {

    const OTP = Math.floor(Math.random() * 899999 + 100000);

    let authData = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.KALSULTANT_EMAIL,
            pass: process.env.KALSULTANT_PASSWORD,
        }
    })

    //sending mail authentication  --> todo move the password to .env file

    authData.sendMail({
        from: 'KALSULTANT',
        to: email,
        subject: subject,
        text: `${text} ${OTP}`
    }).then(() => {
        pool.query('UPDATE USERS SET OTP=$1 where email = $2', [OTP, email], (error, results) => {
            if (error) {
                console.log(error.message);
            }
            else {
                console.log(results);
            }
        })
    }).catch((err)=>{
        console.log(err);
    })


}

const sendEmailUserLoginNotify = (email) => {
    let authData = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.KALSULTANT_EMAIL,
            pass: process.env.KALSULTANT_PASSWORD
        }
    })

    authData.sendMail({
        from:'KALSULTANT',
        to:email,
        subject:'KALSULTANT - Astro Consultants. You logged in using auth provider',
        text:'You logged into kalsultant.com using one of the single sign on providers.'
    })
}

//Create JWT TOKEN
const createJWT = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '5d',
    })
}

module.exports = {
    getUsers,
    RegisterUserUsingEmail,
    handleProviderAuth,
    signInUser,
    verifyOTPForEmail,
    forgotPassword,
    resetPassword,
    getUserData
}