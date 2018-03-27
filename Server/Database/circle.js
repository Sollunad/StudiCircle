const Sequelize = require('sequelize'),
	sequelize = require('./connection.js');

const Circle = sequelize.define('Circle', {
	name: Sequelize.STRING,
	visible: Sequelize.BOOLEAN
}, {
	timestamps: false
});
module.exports = Circle;
