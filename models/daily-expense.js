const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

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
  type_category: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Category',
      key: 'id',
    },
  },
});

DailyExpense.associate = (models) => {
  DailyExpense.belongsTo(models.Category, { foreignKey: 'type_category' });
};

module.exports = DailyExpense;
