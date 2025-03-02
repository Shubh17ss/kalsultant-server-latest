const { Router } = require('express');
const router = Router();
const controller = require('../Controller/user');

router.post('/userContactUsForm', controller.recordUserQuery);

module.exports = router;