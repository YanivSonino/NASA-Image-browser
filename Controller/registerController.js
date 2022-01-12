const Cookies = require('cookies');
const keys = ['keyboard cat']

/*Load registration page*/
exports.register_load_page = (req, res, next) => {
    res.render('register', {title: "Mars Images Browser - Register", jsPath: "/js/register.js"});
}

/*Load password page, and activate cookie timer for password submit*/
exports.register_load_password_page = (req, res, next) => {

    const cookies = new Cookies(req, res, {keys: keys});
    //Sets cookie that indicates about the remaining time to finish the register process.
    cookies.set('RegisterTime', Date.now(),{signed: false, maxAge: 60*1000});
    res.render('password', {FirstName: req.body.FirstName.trim(), LastName: req.body.LastName.trim(), Email: req.body.Email,
        title: "Mars Images Browser - Register", jsPath: "/js/password.js"});
}