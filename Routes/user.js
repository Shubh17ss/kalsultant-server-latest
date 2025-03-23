const { Router } = require('express');
const router = Router();
const controller = require('../Controller/user');

router.post('/userContactUsForm', controller.recordUserQuery);
router.post('/storeReview',controller.storeReview);

module.exports = router;