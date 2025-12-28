const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
      allowNull: true  // Make optional
    }
  }, {
    tableName: 'collectors',
    timestamps: false
  });

  return Collector;
};
