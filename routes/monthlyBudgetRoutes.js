const express = require('express');
const monthlyBudgetController = require('../controllers/monthlyBudgetController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.post(
  '/create-budget',
  tokenMiddleware,
  monthlyBudgetController.createMonthlyBudget
);
router.put(
  '/edit-budget/:id',
  tokenMiddleware,
  monthlyBudgetController.editMonthlyBudget
);
router.get(
  '/lists/:walletId',
  tokenMiddleware,
  monthlyBudgetController.getMonthlyBudgets
);
router.get(
  '/budget-detail/:id',
  tokenMiddleware,
  monthlyBudgetController.getMonthlyBudgetDetail
);
router.delete(
  '/delete-budget/:id',
  tokenMiddleware,
  monthlyBudgetController.deleteMonthlyBudget
);

module.exports = router;
