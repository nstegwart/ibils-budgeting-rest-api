const Category = require('../models/category');
const MonthlyBudgeting = require('../models/monthly-budget');

exports.createMonthlyBudget = async (req, res) => {
  try {
    const { walletId, categoryId, date, amount, budget_name } = req.body;
    const newBudget = await MonthlyBudgeting.create({
      walletId,
      categoryId,
      date,
      amount,
      budget_name,
    });
    res.status(201).json({
      message: 'Monthly budget created successfully',
      data: newBudget,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating monthly budget', error: error.message });
  }
};

exports.editMonthlyBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { walletId, categoryId, date, amount, budget_name } = req.body;
    const budget = await MonthlyBudgeting.findByPk(id);
    if (!budget) {
      return res.status(404).json({ message: 'Monthly budget not found' });
    }
    await budget.update({ walletId, categoryId, date, amount, budget_name });
    res
      .status(200)
      .json({ message: 'Monthly budget updated successfully', data: budget });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating monthly budget', error: error.message });
  }
};

exports.getMonthlyBudgets = async (req, res) => {
  try {
    const { walletId } = req.params;
    const budgets = await MonthlyBudgeting.findAll({
      where: { walletId: walletId },
      include: [
        { model: Category, attributes: ['category_name', 'category_type'] },
      ],
    });
    res.status(200).json({ data: budgets });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching monthly budgets',
      error: error.message,
    });
  }
};

exports.getMonthlyBudgetDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await MonthlyBudgeting.findByPk(id);
    if (!budget) {
      return res.status(404).json({ message: 'Monthly budget not found' });
    }
    res.status(200).json({ budget });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching monthly budget detail',
      error: error.message,
    });
  }
};

exports.deleteMonthlyBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await MonthlyBudgeting.findByPk(id);
    if (!budget) {
      return res.status(404).json({ message: 'Monthly budget not found' });
    }
    await budget.destroy();
    res.status(200).json({ message: 'Monthly budget deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting monthly budget', error: error.message });
  }
};
