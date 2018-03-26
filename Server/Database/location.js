const Sequelize = require('sequelize'),
	sequelize = require('./connection.js');

const Location = sequelize.define('Location', {
	longitude: Sequelize.DOUBLE,
	latitude: Sequelize.DOUBLE
});
module.exports = Location;