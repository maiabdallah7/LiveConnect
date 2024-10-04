const express = require('express');
const authController = require('../Controllers/authController');
const isAuth = require('../Middleware/isAuth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
