const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const PremiumStatus = sequelize.define('PremiumStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  premium_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_package: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Package',
      key: 'id',
    },
    allowNull: true, // Allow null if no package is associated (e.g., free trial)
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: true, // Allow null if there's no specific expiration (e.g., indefinite premium)
  },
});

PremiumStatus.associate = (models) => {
  PremiumStatus.belongsTo(models.User, { foreignKey: 'id_user' });
  PremiumStatus.belongsTo(models.Package, { foreignKey: 'id_package' }); // New association
};

module.exports = PremiumStatus;
