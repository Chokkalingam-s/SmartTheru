module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    points: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'routes',
    timestamps: true
  });

  return Route;
};
