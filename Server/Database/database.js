const Sequelize = require('sequelize');
const sequelize = require('./connection.js');

const Circle = require('./circle.js');
const Location = require('./location.js');

/**
 * n:m - CIRCLES AND LOCATIONS
 **/
const CircleLocation = sequelize.define('CircleLocation', {});
Circle.belongsToMany(Location, { as: 'locations', through: { model: CircleLocation }, foreignKey: 'circle_id' });
Location.belongsToMany(Circle, { as: 'circles', through: { model: CircleLocation }, foreignKey: 'location_id' });

module.exports = {
	Circle: Circle,
	Location: Location,
};