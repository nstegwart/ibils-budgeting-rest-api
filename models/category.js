const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const CategoryIcon = require('./category-icon');
const User = require('./user');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category_icon: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CategoryIcon,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  associate_to: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Category;
