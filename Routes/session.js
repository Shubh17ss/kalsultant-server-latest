const {Router}=require('express');
const router=Router();
const controller=require('../Controller/session');
const adminController=require('../Controller/admin');

router.post('/createSession',controller.createSession);
router.post('/createMeetingInvite',controller.createMeetingInvite);
router.get('/getUserSessions',controller.getUserSessions);
router.post('/setMeetingLink',controller.setMeetingLink);
router.post('/getBookedSlots',controller.getBookedSLots);
router.post('/getAllSessions',adminController.validateJWT,controller.getAllSessions);
router.put('/updateSessionStatus',adminController.validateJWT,controller.updateSessionStatus);


module.exports=router;