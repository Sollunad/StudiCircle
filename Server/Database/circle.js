const config = require('./config.json');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config);

console.log(config);

const Circle = sequelize.define('Circle', {
	name: Sequelize.STRING,
	visible: Sequelize.BOOLEAN
});

// Circle.sync({
// 	force: true
// });

const Location = sequelize.define('Location', {
	longitude: Sequelize.DOUBLE,
	latitude: Sequelize.DOUBLE
});

// Location.sync({
// 	force: true
// });

const CircleLocation = sequelize.define('CircleLocation', {});

Circle.belongsToMany(Location, { as: 'locations', through: { model: CircleLocation }, foreignKey: 'circle_id' });
Location.belongsToMany(Circle, { as: 'circles', through: { model: CircleLocation }, foreignKey: 'location_id' });

module.exports.Circle = Circle;
module.exports.Location = Location;
