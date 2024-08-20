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

    const budgetWithCategory = await MonthlyBudgeting.findByPk(newBudget.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name', 'category_type'],
        },
      ],
    });

    const formatData = {
      id: budgetWithCategory.id,
      walletId: budgetWithCategory.walletId,
      date: budgetWithCategory.date,
      amount: budgetWithCategory.amount,
      budget_name: budgetWithCategory.budget_name,
      category_budget: budgetWithCategory.Category,
    };

    res.status(201).json({
      message: 'Monthly budget created successfully',
      data: formatData,
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

    const updatedBudget = await MonthlyBudgeting.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name', 'category_type'],
        },
      ],
    });

    const formatData = {
      id: updatedBudget.id,
      walletId: updatedBudget.walletId,
      date: updatedBudget.date,
      amount: updatedBudget.amount,
      budget_name: updatedBudget.budget_name,
      category_budget: updatedBudget.Category,
    };

    res.status(200).json({
      message: 'Monthly budget updated successfully',
      data: formatData,
    });
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
        {
          model: Category,
          attributes: ['id', 'category_name', 'category_type'],
        },
      ],
    });
    const formattedBudget = budgets.map((budget) => ({
      id: budget.id,
      walletId: budget.walletId,
      date: budget.date,
      amount: budget.amount,
      budget_name: budget.budget_name,
      category_budget: budget.Category,
    }));

    res.status(200).json({ data: formattedBudget });
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
    const budget = await MonthlyBudgeting.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name', 'category_type'],
        },
      ],
    });
    if (!budget) {
      return res.status(404).json({ message: 'Monthly budget not found' });
    }
    const formatData = {
      id: budget.id,
      walletId: budget.walletId,
      date: budget.date,
      amount: budget.amount,
      budget_name: budget.budget_name,
      category_budget: budget.Category,
    };
    res.status(200).json({ data: formatData });
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
