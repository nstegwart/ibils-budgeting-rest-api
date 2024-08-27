const { Op } = require('sequelize');
const DailyExpense = require('../models/daily-expense');
const Category = require('../models/category');
const CategoryIcon = require('../models/category-icon');
const Currency = require('../models/currency');
const User = require('../models/user');
const {
  formatCurrencyDefault,
  formatCurrencyWithCode,
} = require('../utils/currency');

exports.getHomepage = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const walletId = req.query.wallet_id;

    if (!walletId) {
      return res.status(400).json({ message: 'Wallet ID is required' });
    }

    // Fetch the user's preferred currency
    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: Currency, as: 'preferredCurrency' }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currencyCode = user.preferredCurrency
      ? user.preferredCurrency.code
      : 'IDR'; // Default to IDR if no currency set

    // Get the start and end of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Get monthly transactions for the specific wallet
    const monthlyTransactions = await DailyExpense.findAll({
      where: {
        date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
        walletId: walletId,
      },
    });

    // Calculate monthly totals
    let totalIncome = 0;
    let totalExpense = 0;

    monthlyTransactions.forEach((transaction) => {
      if (transaction.category_type === 'addition') {
        totalIncome += parseFloat(transaction.amount);
      } else {
        totalExpense += parseFloat(transaction.amount);
      }
    });

    const totalBalance = totalIncome - totalExpense;

    // Get today's transactions for the specific wallet
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todayTransactions = await DailyExpense.findAll({
      where: {
        date: {
          [Op.between]: [today, todayEnd],
        },
        walletId: walletId,
      },
      include: [
        {
          model: Category,
          attributes: ['category_name'],
          include: [
            {
              model: CategoryIcon,
              as: 'icon',
              attributes: ['name_icon', 'icon_url'],
            },
          ],
        },
      ],
      order: [['date', 'DESC']],
    });

    const formattedTransactions = todayTransactions.map((transaction) => ({
      id: transaction.id,
      transaction_name: transaction.transaction_name,
      category_type: transaction.category_type,
      amount: formatCurrencyWithCode(
        transaction.amount,
        currencyCode,
        transaction.category_type === 'subtraction'
      ),
      category_icon: transaction.Category.icon,
    }));

    res.status(200).json({
      data: {
        monthly_transaction: {
          total_balance: formatCurrencyDefault(totalBalance, currencyCode),
          total_expense: formatCurrencyWithCode(
            totalExpense,
            currencyCode,
            true
          ),
          total_income: formatCurrencyDefault(totalIncome, currencyCode),
        },
        transaction: formattedTransactions,
      },
    });
  } catch (error) {
    console.error('Error in getHomepage:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
