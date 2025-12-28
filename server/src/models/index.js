const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

// Import model definitions
const User = require('./user')(sequelize, DataTypes);
const Route = require('./Route')(sequelize, DataTypes);
const Collector = require('./Collector')(sequelize, DataTypes);  // ADD THIS
const RouteAssignment = require('./route_assignments').RouteAssignment;  // ADD THIS

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Route,
  Collector,  // ADD THIS
  RouteAssignment  // ADD THIS
};
