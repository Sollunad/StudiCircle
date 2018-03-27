const Sequelize = require('sequelize');
const sequelize = require('./connection.js');

const User = require('./user.js');
const Circle = require('./circle.js');
const Location = require('./location.js');

/**
 * n:m - CIRCLES AND LOCATIONS
 **/
const CircleLocation = sequelize.define('CircleLocation', {});
Circle.belongsToMany(Location, { through: CircleLocation });
Location.belongsToMany(Circle, { through: CircleLocation });

/**
 * n:m - CIRCLES AND USERS
 **/
const UserInCircles = sequelize.define('UserInCircles', {
	role: Sequelize.STRING
});
User.belongsToMany(Circle, { through: UserInCircles });
Circle.belongsToMany(User, { through: UserInCircles });

/** in der Node-Konsole aufrufen um die Tabellen zu erzeugen/upzudaten (das gehört in den Duden) */
function init() {
	User.sync({force:true});
	Circle.sync({force:true});
	Location.sync({force:true}).then(() => {
		CircleLocation.sync({force:true});
		UserInCircles.sync({force:true});	
	});
}

module.exports = {
	Circle: Circle,
	Location: Location,
	User: User,
	CircleLocation: CircleLocation,
	UserInCircles: UserInCircles
};
