const express = require('express');
const authRoutes = require('./authRoutes');
const packageRoutes = require('./packageRoutes');
const userRoutes = require('./userRoutes');
const walletRoutes = require('./walletRoutes');
const monthlyBudgetRoutes = require('./monthlyBudgetRoutes');
const dailyExpenseRoutes = require('./dailyExpenseRoutes');
const categoryRoutes = require('./categoryRoutes');

const homepageController = require('../controllers/homepageController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/packages', packageRoutes);
router.use('/user', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/budgeting', monthlyBudgetRoutes);
router.use('/expense', dailyExpenseRoutes);
router.use('/category', categoryRoutes);

router.get('/homepage', tokenMiddleware, homepageController.getHomepage);

module.exports = router;
