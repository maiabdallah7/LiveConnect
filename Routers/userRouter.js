const express = require('express');
const userController = require('../Controllers/userController');
const isAuth = require('../Middleware/isAuth');
const upload= require('../Middleware/uploadFiles')
const router = express.Router();

//http://localhost:3000/api/userinfo/followUser/670dbfd2d188d91228419b29
router.put('/updateUserData',isAuth,upload.single('image'),userController.UpdateUser);
router.put('/followUser/:followId',isAuth, userController.followUser)

module.exports = router;
