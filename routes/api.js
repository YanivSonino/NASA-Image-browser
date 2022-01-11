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

router.post('/save', (req, res, next) => {

    let {imageID, img_src, sol, earth_date, camera} = req.body

    db.Image.findOrCreate({where: {imageID, img_src, sol, earth_date, camera, email: req.session.email}})
        .then(([image, created]) => {
            if(created){
                res.send({code:true, message: "Image has been saved."})
            }
            else{
                res.send({code:false, message: "Image is already been saved."})
            }
        })
        .catch(err => res.send(err))
})

router.delete('/delete/:imageID', async (req, res, next) => {

    let respond = await db.Image.destroy({where: {imageID: req.params.imageID, email: req.session.email}});
    if(respond){
        res.send({code:true});
    }
    else{
        res.send({code:false});
    }
})

router.get('/getImages', async (req, res, next) => {
    let images = await db.Image.findAll({where: {email: req.session.email}});
    if(images){
        res.json({code: true, images})
    }
    else{
        res.json({code:false, images:null})
    }
})

router.delete('/reset', async (req, res, next) => {
    let respond = await db.Image.destroy({where: {email: req.session.email}});
    if(respond){
        res.send({code:true});
    }
    else{
        res.send({code:false});
    }
})


module.exports = router;