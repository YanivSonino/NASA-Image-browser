const db = require('../models')
const Cookies = require('cookies');
const keys = ['keyboard cat'];

/*Checks if user email is exits*/
exports.api_email_check = async (req, res, next) => {
    //Checks if the received email is already exist.
    console.log(req.params.email)
    let user = await db.User.findOne({where: {email: req.params.email}})
    if (!user) {
        res.send({code: true, message: 'Ok'})
    } else {
        res.send({code: false, message: "Email is already exist", url: "http://localhost:3000/register"})
    }
}

/*Gets image id by params, then create in database image details.
* If the image is already exits we let the user know about it*/
exports.api_find_or_create_img = (req, res, next) => {

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
}

/*Gets image id and remove it from database*/
exports.api_delete_image = async (req, res, next) => {

    let respond = await db.Image.destroy({where: {imageID: req.params.imageID, email: req.session.email}});
    if(respond){
        res.send({code:true});
    }
    else{
        res.send({code:false});
    }
}

/*Load all user saved image from database*/
exports.api_user_images = async (req, res, next) => {
    let images = await db.Image.findAll({where: {email: req.session.email}});
    if(images){
        res.json({code: true, images})
    }
    else{
        res.json({code:false, images:null})
    }
}

/*Reset Image database of user*/
exports.api_reset_images = async (req, res, next) => {
    let respond = await db.Image.destroy({where: {email: req.session.email}});
    if(respond){
        res.send({code:true});
    }
    else{
        res.send({code:false});
    }
}

