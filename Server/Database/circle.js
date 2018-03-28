const Sequelize = require('sequelize'),
	sequelize = require('./connection.js');

const Circle = sequelize.define('Circle', {
	name: Sequelize.STRING,
	visible: Sequelize.BOOLEAN,
	// MODUL - Booleans (existiert/existiert nicht)
	blackboard: Sequelize.BOOLEAN,
	calendar: Sequelize.BOOLEAN,
	bill: Sequelize.BOOLEAN,
	bet: Sequelize.BOOLEAN,
	filesharing: Sequelize.BOOLEAN,
	chat: Sequelize.BOOLEAN,
	market: Sequelize.BOOLEAN
}, {
	timestamps: false
});
module.exports = Circle;
