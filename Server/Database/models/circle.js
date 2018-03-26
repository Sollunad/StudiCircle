'use strict';
module.exports = (sequelize, DataTypes) => {
  var circle = sequelize.define('circle', {
    name: DataTypes.STRING,
    visibility: DataTypes.BOOLEAN,
    admin: DataTypes.INTEGER
  }, {});
  circle.associate = function(models) {
    // associations can be defined here
  };
  return circle;
};