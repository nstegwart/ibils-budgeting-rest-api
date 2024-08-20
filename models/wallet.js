const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');
const CategoryIcon = require('./category-icon');

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  wallet_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wallet_icon: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CategoryIcon,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

module.exports = Wallet;
