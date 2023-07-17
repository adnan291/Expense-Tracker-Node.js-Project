const express = require('express');

const userAuthentication = require("../middleware/auth");

const purchaseController = require('../controllers/purchase');

const router=express.Router();

router.get('/premiumMembership', userAuthentication.authenticate, purchaseController.postPurchase);
router.post('/updateTransactonStatus', userAuthentication.authenticate, purchaseController.updateTransactonStatus);



module.exports = router;