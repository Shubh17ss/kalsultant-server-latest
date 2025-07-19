const { Router } = require('express');
const router = Router();
const controller = require('../Controller/user');

router.post('/userContactUsForm', controller.recordUserQuery);
router.post('/storeReview',controller.storeReview);
router.get('/reviews', controller.getUsersReviews);

module.exports = router;