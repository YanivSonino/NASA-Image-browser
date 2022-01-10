let express = require('express');
let router = express.Router();
const db = require("../models");

router.get('/email/:email', (async (req, res, next) => {
    //Checks if the received email is already exist.
    console.log(req.params.email)
    let user = await db.User.findOne({where: {email: req.params.email}})
    if (!user) {
        res.send({code: true, message: 'Ok'})
    } else {
        res.send({code: false, message: "Email is already exist", url: "http://localhost:3000/register"})
    }
}))


module.exports = router;