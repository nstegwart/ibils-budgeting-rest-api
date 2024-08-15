const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const CategoryIcon = sequelize.define('CategoryIcon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_icon: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = CategoryIcon;
