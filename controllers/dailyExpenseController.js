const Category = require('../models/category');
const CategoryIcon = require('../models/category-icon');
const DailyExpense = require('../models/daily-expense');

exports.createDailyExpense = async (req, res) => {
  try {
    const { walletId, categoryId, amount, date, note, photo_transaction } =
      req.body;
    const newExpense = await DailyExpense.create({
      walletId,
      categoryId,
      amount,
      date,
      note,
      photo_transaction,
    });
    res.status(201).json({
      message: 'Daily expense created successfully',
      data: newExpense,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating daily expense', error: error.message });
  }
};

exports.editDailyExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, amount, date, note, photo_transaction } = req.body;
    const expense = await DailyExpense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: 'Daily expense not found' });
    }
    await expense.update({ categoryId, amount, date, note, photo_transaction });
    res
      .status(200)
      .json({ message: 'Daily expense updated successfully', data: expense });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating daily expense', error: error.message });
  }
};

exports.deleteDailyExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await DailyExpense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: 'Daily expense not found' });
    }
    await expense.destroy();
    res.status(200).json({ message: 'Daily expense deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting daily expense', error: error.message });
  }
};

exports.getDailyExpenses = async (req, res) => {
  try {
    const { walletId } = req.params;
    const expenses = await DailyExpense.findAll({
      where: { walletId: walletId },
      include: [
        {
          model: Category,
          attributes: [
            'category_name',
            'category_type',
            'default_category_icon',
          ],
          include: [
            {
              model: CategoryIcon,
              as: 'icon',
              attributes: ['name_icon', 'icon_url'],
            },
          ],
        },
      ],
    });

    const formattedExpenses = expenses.map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      date: expense.date,
      note: expense.note,
      photo_transaction: expense.photo_transaction,
      walletId: expense.walletId,
      categoryId: expense.categoryId,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      category: {
        category_name: expense.Category.category_name,
        category_type: expense.Category.category_type,
        default_category_icon: expense.Category.default_category_icon,
        category_icon: expense.Category.icon
          ? {
              name_icon: expense.Category.icon.name_icon,
              icon_url: expense.Category.icon.icon_url,
            }
          : null,
      },
    }));

    res.status(200).json({ data: formattedExpenses });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching daily expenses', error: error.message });
  }
};

exports.getDailyExpenseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await DailyExpense.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: [
            'category_name',
            'category_type',
            'default_category_icon',
          ],
          include: [
            {
              model: CategoryIcon,
              as: 'icon',
              attributes: ['name_icon', 'icon_url'],
            },
          ],
        },
      ],
    });
    if (!expense) {
      return res.status(404).json({ message: 'Daily expense not found' });
    }
    const formattedExpenses = {
      id: expense.id,
      amount: expense.amount,
      date: expense.date,
      note: expense.note,
      photo_transaction: expense.photo_transaction,
      walletId: expense.walletId,
      categoryId: expense.categoryId,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      category: {
        category_name: expense.Category.category_name,
        category_type: expense.Category.category_type,
        default_category_icon: expense.Category.default_category_icon,
        category_icon: expense.Category.icon
          ? {
              name_icon: expense.Category.icon.name_icon,
              icon_url: expense.Category.icon.icon_url,
            }
          : null,
      },
    };

    res.status(200).json({ data: formattedExpenses });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching daily expense detail',
      error: error.message,
    });
  }
};
