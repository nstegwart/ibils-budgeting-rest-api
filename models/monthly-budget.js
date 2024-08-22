const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Category = require('./category');
const Wallet = require('./wallet');

const MonthlyBudgeting = sequelize.define('MonthlyBudgeting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  walletId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Wallet,
      key: 'id',
    },
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },

  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  budget_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category_type: {
    type: DataTypes.ENUM('addition', 'subtraction'),
    allowNull: false,
  },
});

module.exports = MonthlyBudgeting;
