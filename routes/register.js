const express = require('express');
const router = express.Router();
const registerController = require('../Controller/registerController')

/* GET register page. */
router.get('/', registerController.register_load_page);

/* POST password page. */
router.post('/password', registerController.register_load_password_page);

module.exports = router;