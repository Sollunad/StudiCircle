const config = require('./config.json'),
	Sequelize = require('sequelize');
const sequelize = new Sequelize(config);
module.exports = sequelize;
