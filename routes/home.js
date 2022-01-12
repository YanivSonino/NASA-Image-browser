const express = require('express');
const router = express.Router();
const homeController = require('../Controller/homeController');

router.use(homeController.check_safe_page)

router.get('/', homeController.user_home);

router.post('/logout',homeController.user_logout);

module.exports = router;