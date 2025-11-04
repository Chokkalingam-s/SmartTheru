const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

// Import model definitions
const User = require('./user')(sequelize, DataTypes);
const Route = require('./Route')(sequelize, DataTypes);
// Import other models similarly (vehicle, route, checkpoint, etc.)

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Route,
  // Vehicle,
  // Route,
  // Checkpoint,
  // ProgressLog,
};
