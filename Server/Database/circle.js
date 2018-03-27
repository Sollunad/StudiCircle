const Sequelize = require('sequelize'),
	sequelize = require('./connection.js');

const Circle = sequelize.define('Circle', {
	name: Sequelize.STRING,
	visible: Sequelize.BOOLEAN
});

const Location = sequelize.define('Location', {
	longitude: Sequelize.DOUBLE,
	latitude: Sequelize.DOUBLE
});

const UsersCircles = sequelize.define('UsersCircles', {
	userID: Sequelize.INTEGER,
	circleID: Sequelize.INTEGER
});

// zur initialisierung, Stefan oder Marcel fragen
//Circle.sync({force:true});
//Location.sync({force:true});
//UsersCircles.sync({force:true});

const CircleLocation = sequelize.define('CircleLocation', {});

Circle.belongsToMany(Location, { as: 'locations', through: { model: CircleLocation }, foreignKey: 'circle_id' });
Location.belongsToMany(Circle, { as: 'circles', through: { model: CircleLocation }, foreignKey: 'location_id' });

module.exports.Circle = Circle;
module.exports.Location = Location;
module.exports.UsersCircles = UsersCircles;
module.exports = Circle;
