const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');

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
    type: DataTypes.STRING,
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
