const express = require('express');

const signupController = require('../controllers/user');

const router = express.Router();

router.post('/signup', signupController.signupUser);
router.post('/login', signupController.loginUser);

module.exports = router;

