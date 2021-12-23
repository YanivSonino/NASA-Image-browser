let express = require('express');
let router = express.Router();
const Users = require('../modals/Users');

router.get('/email/:email', ((req, res, next) => {
    //Checks if the received email is already exist.
    if(Users.fetchAllUsers().some(user => req.params.email === user.getEmail())){
        res.send({code: false, massage: "Email is already exist", url: "http://localhost:3000/register"});
    }
    res.send({code: true, massage: 'Ok'})
}))


module.exports = router;