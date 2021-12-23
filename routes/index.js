let express = require('express');
let router = express.Router();

const Users = require('../modals/Users');

const Cookies = require('cookies');
const keys = ['keyboard cat'];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', {title: "Mars Images Browser", jsPath: "/js/landingPage.js"});
});

router.post('/', ((req, res, next) =>{
  const cookies = new Cookies(req, res, {keys: keys});
  const RegisterTime = cookies.get('RegisterTime', {signed: false});

  //Validate that the cookie of the time to register is not expired and if so, save the user in the data base.
  if(!RegisterTime){
    res.render('register', {title: "Mars Images Browser", jsPath: "/js/register.js"});
  }
  else{
    let user = new Users(req.body.FirstName, req.body.LastName, req.body.Email, req.body.Password);
    user.save();
    res.render('landing', {title: "Mars Images Browser - Login", jsPath: "/js/landingPage.js", massage:"You have been registered successfully"});
  }
}))


module.exports = router;