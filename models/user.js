const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  register_via: {
    type: DataTypes.ENUM('fb', 'google', 'apple', 'internal'),
    allowNull: false,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  avatar_url: {
    type: DataTypes.STRING,
  },
  user_language: {
    type: DataTypes.STRING,
  },
  profile_picture: {
    type: DataTypes.STRING,
  },
});

User.associate = (models) => {
  User.hasMany(models.Wallet, { foreignKey: 'user_id' });
  User.hasMany(models.PremiumStatus, { foreignKey: 'user_id' });
  User.hasMany(models.OTP, { foreignKey: 'user_id' });
  User.hasMany(models.Category, { foreignKey: 'user_id' });
};

module.exports = User;
