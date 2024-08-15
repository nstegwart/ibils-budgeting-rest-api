const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

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
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',
    },
  },
});

Wallet.associate = (models) => {
  Wallet.belongsTo(models.User, { foreignKey: 'user_id' });
  Wallet.hasMany(models.MonthlyBudgeting, { foreignKey: 'wallet_id' });
};

module.exports = Wallet;
