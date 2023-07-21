const express = require('express');

const forgotPasswordController = require('../controllers/forgotpassword');

const router = express.Router();

router.post('/forgotpassword', forgotPasswordController.forgotPassword);
router.get('/resetpassword/:id', forgotPasswordController.resetPassword);
router.get('/updatepassword/:rid', forgotPasswordController.updatePassword);

module.exports = router;