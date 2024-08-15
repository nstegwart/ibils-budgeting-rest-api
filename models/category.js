const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

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
    type: DataTypes.STRING,
  },
  category_type: {
    type: DataTypes.ENUM('addition', 'subtraction'),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',
    },
  },
});

Category.associate = (models) => {
  Category.belongsTo(models.User, { foreignKey: 'user_id' });
  Category.hasMany(models.DailyExpense, { foreignKey: 'category_type' });
  Category.hasMany(models.MonthlyBudget, { foreignKey: 'category_id' });
};

module.exports = Category;
