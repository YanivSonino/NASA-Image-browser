const db = require('../models')
const Cookies = require('cookies');
const keys = ['keyboard cat'];

/*User first land in the website, if the user it authorized he will move to homepage,
 *otherwise he will lang in landing page for registration*/
exports.user_landing = (req, res, next) =>{
    if(!req.session.isAuth){
        res.render('landing', {title: "Mars Images Browser", jsPath: "/js/landingPage.js"});
        return;
    }
    res.redirect('/home');
}

/*User finish registration we handle two situation.
 *First, user did not mange to finish his registration a successfully so he will be back into registration page.
 *Second, user finish his registration and moving to landing page and ready to login*/
exports.user_finish_register = (req, res, next) =>{
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
}

/*User is willing to login, if he successfully logged in he will move to homepage,
 *otherwise he will go back to landing page to retry login.*/
exports.user_login = (req, res) => {
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
}
