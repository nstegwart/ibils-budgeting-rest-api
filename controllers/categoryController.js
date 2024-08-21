const { Op } = require('sequelize');
const Category = require('../models/category');
const CategoryIcon = require('../models/category-icon');

exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: null },
      include: [
        {
          model: CategoryIcon,
          as: 'icon',
          attributes: ['name_icon', 'icon_url'],
        },
      ],
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      category_name: category.category_name,
      default_category_icon: category.default_category_icon,
      category_icon: category.icon,
      category_type: category.category_type,
      is_my_category: false,
    }));

    res.status(200).json({ data: formattedCategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching public categories' });
  }
};

exports.getUserCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.userData.userId },
      include: [
        {
          model: CategoryIcon,
          as: 'icon',
          attributes: ['name_icon', 'icon_url'],
        },
      ],
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      category_name: category.category_name,
      default_category_icon: category.default_category_icon,
      category_icon: category.icon,
      category_type: category.category_type,
      is_my_category: true,
    }));
    res.status(200).json({ data: formattedCategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user categories' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { category_name, category_type, category_icon } = req.body;
    const newCategory = await Category.create({
      category_name,
      category_type,
      category_icon,
      userId: req.userData.userId,
    });
    res.status(201).json({ data: newCategory });
  } catch (error) {
    res.status(400).json({ message: 'Error creating category' });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, category_type, category_icon } = req.body;
    const category = await Category.findOne({
      where: { id, userId: req.userData.userId },
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: 'Category not found or not owned by user' });
    }

    await category.update({ category_name, category_type, category_icon });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      where: { id, userId: req.userData.userId },
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: 'Category not found or not owned by user' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

exports.getCategoryIcons = async (req, res) => {
  try {
    const icons = await CategoryIcon.findAll({
      attributes: ['id', 'name_icon', 'icon_url'],
    });
    res.json({ data: icons });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category icons' });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const categories = await Category.findAll({
      where: {
        [Op.or]: [{ userId: null }, { userId: userId }],
      },
      include: [
        {
          model: CategoryIcon,
          as: 'icon',
          attributes: ['name_icon', 'icon_url'],
        },
      ],
    });

    const formattedCategories = categories.map((category) => ({
      ...category.toJSON(),
      is_my_category: category.userId === userId,
    }));

    res.status(200).json({
      message: 'Categories fetched successfully',
      categories: formattedCategories,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};
