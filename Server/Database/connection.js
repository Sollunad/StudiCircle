const config = require('./config_localhost.json'),
	Sequelize = require('sequelize');
const sequelize = new Sequelize(config);
module.exports = sequelize;