const config = require('./config.json');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config);

console.log(config);

const Circle = sequelize.define('Circle', {
	name: Sequelize.STRING,
	visible: Sequelize.BOOLEAN
});

const Location = sequelize.define('Location', {
	longitude: Sequelize.DOUBLE,
	latitude: Sequelize.DOUBLE
});

// zur initialisierung, Stefan oder Marcel fragen
//Circle.sync({force:true});
//Location.sync({force:true});

const CircleLocation = sequelize.define('CircleLocation', {});

Circle.belongsToMany(Location, { as: 'locations', through: { model: CircleLocation }, foreignKey: 'circle_id' });
Location.belongsToMany(Circle, { as: 'circles', through: { model: CircleLocation }, foreignKey: 'location_id' });

module.exports.Circle = Circle;
module.exports.Location = Location;
