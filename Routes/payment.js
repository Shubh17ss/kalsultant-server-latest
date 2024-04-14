const {Router} = require('express');
const router=Router();
const controller=require('../Controller/payment');

router.get('/createIntent',controller.createIntent);


module.exports=router;
