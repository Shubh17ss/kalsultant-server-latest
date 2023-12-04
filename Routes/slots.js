const {Router}=require('express');
const router=Router();
const controller=require('../Controller/slots');
const adminController=require('../Controller/admin');


router.post('/getslots',adminController.validateJWT,controller.getSlots);
router.post('/addSlot',adminController.validateJWT,controller.addSlot);

module.exports=router;