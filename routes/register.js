let express = require('express');
let router = express.Router();

const Cookies = require('cookies');
const keys = ['keyboard cat'];



router.get('/', (req, res, next) => {
    res.render('register', {title: "Mars Images Browser - Register", jsPath: "/js/register.js"});
});

router.post('/password', (req, res, next) => {
    const cookies = new Cookies(req, res, {keys: keys});
    //Sets cookie that indicates about the remaining time to finish the register process.
    cookies.set('RegisterTime', Date.now(),{signed: false, maxAge: 60*1000});
    res.render('password', {FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email,
                                        title: "Mars Images Browser - Register", jsPath: "/js/password.js"});
});


module.exports = router;