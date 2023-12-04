const {Router}=require('express');
const router=Router();
const controller=require('../Controller/admin')

router.post('/validateAdmin',controller.validateAdmin);
router.post('/validateJWT',controller.validateJWT);



module.exports=router;
