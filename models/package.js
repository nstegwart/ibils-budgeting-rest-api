const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_package: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  days_duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Package;
