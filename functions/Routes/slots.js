const {Router}=require('express');
const router=Router();
const controller=require('../Controller/slots');

//POST ROUTES
router.post('/addSlot',controller.addSlot);
// GET ROUTES
router.post('/getslots',controller.getSlots);

module.exports=router;