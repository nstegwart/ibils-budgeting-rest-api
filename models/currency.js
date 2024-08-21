const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Currency = sequelize.define('Currency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_base_currency: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Currency;
