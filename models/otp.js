const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const OTP = sequelize.define('OTP', {
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
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

OTP.associate = (models) => {
  OTP.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = OTP;
