const express = require('express');
const walletController = require('../controllers/walletController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.get('/user-wallets', tokenMiddleware, walletController.getUserWallets);
router.post('/create-wallet', tokenMiddleware, walletController.createWallet);
router.put(
  '/edit-wallet/:walletId',
  tokenMiddleware,
  walletController.editWallet
);

module.exports = router;
