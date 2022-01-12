let express = require('express');
let router = express.Router();

let registerController = require('../Controller/registerController')
const Cookies = require('cookies');
const keys = ['keyboard cat'];


/* GET register page. */
router.get('/', registerController.register_load_page);
/* POST password page. */
router.post('/password', registerController.register_load_password_page);


module.exports = router;