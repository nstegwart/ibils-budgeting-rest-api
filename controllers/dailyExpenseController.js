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
    const createdExpense = await DailyExpense.findByPk(newExpense.id, {
      include: [
        {
          model: Category,
          include: [{ model: CategoryIcon, as: 'icon' }],
        },
      ],
    });

    const formattedExpense = {
      id: createdExpense.id,
      amount: createdExpense.amount,
      date: createdExpense.date,
      note: createdExpense.note,
      photo_transaction: createdExpense.photo_transaction,
      walletId: createdExpense.walletId,
      category: {
        id: createdExpense.Category.id,
        category_name: createdExpense.Category.category_name,
        category_type: createdExpense.Category.category_type,
        category_icon: createdExpense.Category.icon
          ? {
              name_icon: createdExpense.Category.icon.name_icon,
              icon_url: createdExpense.Category.icon.icon_url,
            }
          : null,
      },
    };

    res.status(201).json({
      message: 'Daily expense created successfully',
      data: formattedExpense,
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
    const updatedExpense = await DailyExpense.findByPk(id, {
      include: [
        {
          model: Category,
          include: [{ model: CategoryIcon, as: 'icon' }],
        },
      ],
    });

    const formattedExpense = {
      id: updatedExpense.id,
      amount: updatedExpense.amount,
      date: updatedExpense.date,
      note: updatedExpense.note,
      photo_transaction: updatedExpense.photo_transaction,
      walletId: updatedExpense.walletId,
      category: {
        id: updatedExpense.Category.id,
        category_name: updatedExpense.Category.category_name,
        category_type: updatedExpense.Category.category_type,
        category_icon: updatedExpense.Category.icon
          ? {
              name_icon: updatedExpense.Category.icon.name_icon,
              icon_url: updatedExpense.Category.icon.icon_url,
            }
          : null,
      },
    };

    res.status(200).json({
      message: 'Daily expense updated successfully',
      data: formattedExpense,
    });
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

exports.getDailyExpensesList = async (req, res) => {
  try {
    const { walletId } = req.params;
    const expenses = await DailyExpense.findAll({
      where: { walletId: walletId },
      include: [
        {
          model: Category,
          attributes: ['category_name', 'category_type'],
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
      category: {
        id: expense.Category.id,
        category_name: expense.Category.category_name,
        category_type: expense.Category.category_type,
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
          attributes: ['category_name', 'category_type'],
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
      category: {
        id: expense.Category.id,
        category_name: expense.Category.category_name,
        category_type: expense.Category.category_type,
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
