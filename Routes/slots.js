const {Router}=require('express');
const router=Router();
const controller=require('../Controller/slots');


router.post('/getslots',controller.getSlots);
router.post('/addSlot',controller.addSlot);

module.exports=router;