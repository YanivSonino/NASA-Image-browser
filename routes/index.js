const express = require('express');
const router = express.Router();
const userController = require('../Controller/indexController')

/* GET home page. */
router.get('/', userController.user_landing);

router.post('/', userController.user_finish_register);

router.post('/login',userController.user_login);

module.exports = router;