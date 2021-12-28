let express = require('express');
let router = express.Router();

const Users = require('../modals/Users');

const Cookies = require('cookies');
const keys = ['keyboard cat'];

let yaniv = new Users("Yaniv","Sonino","yanivsoninno@gmail.com","123456789");
yaniv.save();

/* GET home page. */
router.get('/', function(req, res, next) {
  // if(req.session.loggedIn){
  //   res.render('home', {title: "Home Page", jsPath: "/js/home.js" , userName: req.session.currentUser.getName()})
  // }
  res.render('landing', {title: "Mars Images Browser", jsPath: "/js/landingPage.js"});
});

router.post('/', ((req, res, next) =>{
  const cookies = new Cookies(req, res, {keys: keys});
  const RegisterTime = cookies.get('RegisterTime', {signed: false});

  //Validate that the cookie of the time to register is not expired and if so, save the user in the data base.
  if(!RegisterTime){
    res.render('register', {title: "Mars Images Browser", jsPath: "/js/register.js", message:"You running out of time, Try Again.",messageType: "error"});
  }
  else{
    let user = new Users(req.body.FirstName, req.body.LastName, req.body.Email, req.body.Password);
    user.save();
    res.render('landing', {title: "Mars Images Browser - Login", jsPath: "/js/landingPage.js", message:"You have been registered successfully", messageType: "success"});
  }
}))
router.post('/home',(req, res, next) => {
  let userIndex = Users.fetchAllUsers().findIndex(user => req.body.Email === user.getEmail());
  if(userIndex < 0 || !Users.fetchAllUsers()[userIndex].validatePassword(req.body.Password)){
    res.render('landing', {title: "Mars Images Browser - Login", jsPath: "/js/landingPage.js", message:"Incorrect E-mail or password", messageType:"error"});
  }
  else {
    /*res.session.loggedIn = true;
    res.session.currentUser = Users.fetchAllUsers()[userIndex];*/
    res.render('home', {title: "Home Page", jsPath: "/js/home.js" , userName: Users.fetchAllUsers()[userIndex].getFirstName()})
  }



});

module.exports = router;