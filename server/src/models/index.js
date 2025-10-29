const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

// Import model definitions
const User = require('./user')(sequelize, DataTypes);
// Import other models similarly (vehicle, route, checkpoint, etc.)

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  // Vehicle,
  // Route,
  // Checkpoint,
  // ProgressLog,
};
