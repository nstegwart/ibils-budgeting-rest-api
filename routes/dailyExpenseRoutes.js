const express = require('express');
const dailyExpenseController = require('../controllers/dailyExpenseController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.post(
  '/create',
  tokenMiddleware,
  dailyExpenseController.createDailyExpense
);
router.put(
  '/edit/:id',
  tokenMiddleware,
  dailyExpenseController.editDailyExpense
);
router.delete(
  '/delete/:id',
  tokenMiddleware,
  dailyExpenseController.deleteDailyExpense
);
router.get(
  '/list/:walletId',
  tokenMiddleware,
  dailyExpenseController.getDailyExpenses
);

router.get(
  '/detail/:id',
  tokenMiddleware,
  dailyExpenseController.getDailyExpenseDetail
);

module.exports = router;
