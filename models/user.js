const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Currency = require('./currency');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    register_via: {
      type: DataTypes.ENUM('fb', 'google', 'apple', 'internal'),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_language: {
      type: DataTypes.STRING,
    },
    profile_picture: {
      type: DataTypes.STRING,
    },
    preferredCurrencyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Currency,
        key: 'id',
      },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = User;
