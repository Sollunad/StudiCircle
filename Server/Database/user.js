const Sequelize = require('sequelize'),
	sequelize = require('./connection.js');

const User = sequelize.define('User', {
	name: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING
}, {
	timestamps: false
});
module.exports = User;