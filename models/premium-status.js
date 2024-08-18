const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user'); // Adjust the path as needed
const Package = require('./package'); // Adjust the path as needed

const PremiumStatus = sequelize.define(
  'PremiumStatus',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    premium_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    packageId: {
      type: DataTypes.INTEGER,
      references: {
        model: Package,
        key: 'id',
      },
      allowNull: true,
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = PremiumStatus;
