const express = require('express');
const packageController = require('../controllers/packageController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.get(
  '/history',
  tokenMiddleware,
  packageController.getUserPremiumHistory
);
router.get('/package-list', tokenMiddleware, packageController.getAllPackages);
router.get(
  '/premium-status',
  tokenMiddleware,
  packageController.getUserPremiumStatus
);
router.post(
  '/purchase-premium',
  tokenMiddleware,
  packageController.purchasePremium
);

module.exports = router;
