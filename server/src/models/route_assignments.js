const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const RouteAssignment = sequelize.define('RouteAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  collectorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assignedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('assigned', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'assigned'
  },
  pointsCovered: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // ✅ NEW: Track EXACT points covered
  coveredPoints: {
    type: DataTypes.JSON,
    defaultValue: []  // Array of covered point indices [0, 2, 4]
  },
  currentLat: {
    type: DataTypes.DOUBLE,
    defaultValue: null
  },
  currentLng: {
    type: DataTypes.DOUBLE,
    defaultValue: null
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'RouteAssignments',
  timestamps: true
});

// Associations
RouteAssignment.belongsTo(sequelize.models.Collector, { 
  foreignKey: 'collectorId',
  as: 'collector'
});
RouteAssignment.belongsTo(sequelize.models.Route, { 
  foreignKey: 'routeId', 
  as: 'route' 
});

module.exports = { RouteAssignment };
