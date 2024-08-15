const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const MonthlyBudget = sequelize.define('MonthlyBudget', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  wallet_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Wallet',
      key: 'id',
    },
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Category',
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
});

MonthlyBudget.associate = (models) => {
  MonthlyBudget.belongsTo(models.Wallet, { foreignKey: 'wallet_id' });
  MonthlyBudget.hasMany(models.Budgeting, {
    foreignKey: 'monthly_budgeting_id',
  });
  MonthlyBudget.belongsTo(models.Category, { foreignKey: 'category_id' });
};

module.exports = MonthlyBudget;
