const {Router} = require('express');
const router=Router();
const controller=require('../Controller/whatsApp');

router.post('/sendNotification',controller.sendNotification)


module.exports=router;
