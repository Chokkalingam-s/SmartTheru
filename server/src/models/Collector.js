const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); // Adjust path if needed

const Collector = sequelize.define('Collector', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'collectors', // Ensure table name matches your DB
  timestamps: false
});

module.exports = Collector;
