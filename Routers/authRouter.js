const express = require('express');
const authController = require('../Controllers/authController');
const isAuth = require('../Middleware/isAuth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/users', authController.getAllUsers);
router.post('/logout',authController.logout)
module.exports = router;
