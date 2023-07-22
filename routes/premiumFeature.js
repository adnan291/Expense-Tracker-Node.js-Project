const express = require('express');

const premiumFeatureController = require('../controllers/premiumFeature')

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderboard', authenticatemiddleware.authenticate, premiumFeatureController.getUserLeaderBoard);
router.get('/showDownloaded', authenticatemiddleware.authenticate, premiumFeatureController.getDownloadedURL);

module.exports = router;