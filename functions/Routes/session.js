const { Router } = require('express');
const router = Router();
const controller = require('../Controller/session');

router.post('/createSession', controller.createSession);
router.post('/storeProposedSession', controller.storeProposedSession)
router.get('/getUserSessions', controller.getUserSessions); 
router.post('/getBookedSlots', controller.getBookedSLots);
router.post('/getAllSessions', controller.getAllSessions);
router.put('/updateSessionStatus', controller.updateSessionStatus);
router.post('/storeSessionDataInGoogleSheets', controller.storeSessionDataInGoogleSheets)

//get sessions
router.post('/getSession', controller.getSessionDetails);


module.exports = router;