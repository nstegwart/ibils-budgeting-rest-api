const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Category = require('./category');
const Wallet = require('./wallet');

const DailyExpense = sequelize.define('DailyExpense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
  },
  photo_transaction: {
    type: DataTypes.STRING,
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
  category_type: {
    type: DataTypes.ENUM('addition', 'subtraction'),
    allowNull: false,
  },
});

module.exports = DailyExpense;
