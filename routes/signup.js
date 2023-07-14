const express = require('express');

const signupController = require('../controllers/signup');

const router = express.Router();

router.post('/signup', signupController.postAddUser);
router.post('/login', signupController.postLoginUser);

module.exports = router;

