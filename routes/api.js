const express = require('express');
const router = express.Router();
const apiController = require('../Controller/apiController')


router.get('/email/:email', apiController.api_email_check)

router.post('/save', apiController.api_find_or_create_img)

router.delete('/delete/:imageID', apiController.api_delete_image)

router.get('/getImages', apiController.api_user_images)

router.delete('/reset', apiController.api_reset_images)

module.exports = router;