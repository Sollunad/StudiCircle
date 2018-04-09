// const config = require('./config.json'),
const config = require('./config_localhost'),
	Sequelize = require('sequelize');
const sequelize = new Sequelize(config);
module.exports = sequelize;
