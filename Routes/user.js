const {Router} = require('express');
const router=Router();
const controller=require('../Controller/user');


router.get('/users',controller.getUsers);
router.get('/getUserData',controller.getUserData);
router.post('/createUserUsingEmail',controller.RegisterUserUsingEmail);
router.post('/signin',controller.signInUser);
router.post('/handleproviderauth',controller.handleProviderAuth);
router.post('/forgotPassword',controller.forgotPassword);
router.post('/resetPassword',controller.resetPassword);
router.post('/verifyOtpForEmail',controller.verifyOTPForEmail);

module.exports=router;