let express = require('express');
let router = express.Router();

const bodyParser = require("body-parser");
const {check,validationResult} = require('express-validator')
const urlencodedParser = bodyParser.urlencoded({extended: false});

class User{
  constructor(firstName,lastName,Email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.Email = Email;
    this.Password ="";
  }
  getName(){return this.firstName;}
  getLastName(){return this.lastName;}
  getEmail(){return this.Email;}
  getPassword(){return this.Password;}
  setPassword(value){this.password = value;}
}

let UserData =[];
let user = new User('Yaniv','Sonino','yanivsoninno@gmail.com')
UserData.push(user);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', urlencodedParser, [
    check('FirstName', 'Name is required')
        .exists()
        .isLength({min:1}),
    check('LastName', '')
        .exists()
        .isLength({min:1}),
    check('Email', 'Email is invalid')
        .isEmail()
        .normalizeEmail(),
    check('Email', 'Email is already exist')
        .custom((value) => !UserData.some((user) => value.toLowerCase() === user.getEmail().toLowerCase()))

],(req, res, next) => {
  const errors = validationResult(req);
  //Will execute only if some error happened on html 5 email and 'required' validation.
  if(!errors.isEmpty()){
    const alert = errors.array();
    res.render('register', {alert});
  }
  else{
    user = new User(req.body.FirstName, req.body.LastName, req.body.Email);
    UserData.push(user);
    res.render('password');
  }
});

router.post('/password', urlencodedParser, [
    check('Password', 'Password must be 8+ characters')
        .exists()
        .isLength({min : 8})
], ((req, res, next) =>{
  check('ConfirmPassword', 'Those passwords didn’t match. Try again.')
      .equals(req.body.Password);

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const alert = errors.array();
    res.render('password', {alert});
  }
  else{
    user.setPassword(req.body.Password);
    res.render('login');
  }
}))

router.get('/login', (req, res, next) => {
  res.render('login');
})
router.post('/login', (req, res, next) => {
  res.render('login');
})


module.exports = router;