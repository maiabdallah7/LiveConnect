const express = require('express');
const authController = require('../Controllers/authController');
const isAuth = require('../Middleware/isAuth');
const router = express.Router();

//http://localhost:3000/api/user/register
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/users', authController.getAllUsers);
router.post('/logout',isAuth, authController.logout)
module.exports = router;
