const Sequelize = require('sequelize'),
	sequelize = require('./connection.js');

const Module = sequelize.define('Module', {
	type: Sequelize.STRING
});
module.exports = Module;