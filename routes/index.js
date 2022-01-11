const express = require('express');
const router = express.Router();
const db = require('../models');

const Cookies = require('cookies');
const keys = ['keyboard cat'];

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.isAuth){
        res.render('landing', {title: "Mars Images Browser", jsPath: "/js/landingPage.js"});
        return;
    }
    res.redirect('/home');
});

router.post('/', ((req, res, next) =>{
    const cookies = new Cookies(req, res, {keys: keys});
    const RegisterTime = cookies.get('RegisterTime', {signed: false});

    //Validate that the cookie of the time to register is not expired and if so, save the user in the data base.
    if(!RegisterTime){
        res.render('register', {title: "Mars Images Browser", jsPath: "/js/register.js", message:"You running out of time, Try Again.",messageType: "error"});
    }
    else{
        let {firstName, lastName, email, password} = req.body
        db.User.create({firstName, lastName, email, password})
            .then(user => res.render('landing', {title: "Mars Images Browser - Login", jsPath: "/js/landingPage.js", message:"You have been registered successfully", messageType: "success"}))
            .catch(err => res.send(err))
    }
}))

router.post('/login',(req, res, next) => {

    db.User.findOne({where: {email: req.body.Email}})
        .then((user) => {
            if(!user) {
                res.render('landing', {title: "Mars Images Browser - Login", jsPath: "/js/landingPage.js", message:"Incorrect E-mail or password", messageType:"error"});
            }
            else{
                req.session.isAuth = true;
                req.session.name = user.dataValues.firstName + ' ' + user.dataValues.lastName;
                req.session.email = user.dataValues.email;
                res.redirect('/home')
            }
        })
});

router.use((req, res, next) => {
    if(req.session.isAuth){
        next()
    }
    else{
        req.method = "GET";
        res.status(404).redirect("http://localhost:3000");
    }
})

router.get('/home',(req, res, next) => {
    res.render('home', {title: "Home Page", jsPath: "/js/home.js" , userName: req.session.name})
})

router.post('/logout', (req,res,next)=>{
    req.session.destroy((error) => {
        if (error) throw error;
        console.log('User logout.');
        res.redirect('/');
    });
})

module.exports = router;