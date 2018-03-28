const Sequelize = require('sequelize');
const sequelize = require('./connection.js');

const User = require('./user.js');
const Circle = require('./circle.js');
const Location = require('./location.js');
//const Module = require('./module.js');

/**
 * n:m - CIRCLES AND LOCATIONS
 **/
const CircleLocation = sequelize.define('CircleLocation', {
	//something
}, {
	timestamps: false
});

Circle.belongsToMany(Location, { through: CircleLocation });
Location.belongsToMany(Circle, { through: CircleLocation });
Circle.references = {};
Location.references = {};
Circle.references.location = Location;
Location.references.circle = Circle;


/**
 * n:m - CIRCLES AND USERS
 **/
const UserInCircles = sequelize.define('UserInCircles', {
	role: Sequelize.STRING
}, {
	timestamps: false
});
User.belongsToMany(Circle, { through: UserInCircles });
Circle.belongsToMany(User, { through: UserInCircles });
Circle.references = {};
User.references = {};
Circle.references.user = User;
User.references.circle = Circle;

/**
 * 1:m - CIRCLES AND MODULES
 **/
/*Circle.hasMany(Module);
Module.belongsTo(Circle);*/

/** in der Node-Konsole aufrufen um die Tabellen zu erzeugen/upzudaten (das gehört in den Duden) */
function init() {
	console.log("Database init");
	User.sync({force:true}).then(() => {
		Circle.sync({force:true}).then(() => {
			//Module.sync({force:true}).then(() => {
				Location.sync({force:true}).then(() => {
					CircleLocation.sync({force:true});
					UserInCircles.sync({force:true});
				});
			//});
		});
	});
}

module.exports = {
	init: init,
	Circle: Circle,
	Location: Location,
	User: User,
	//Module: Module,
	CircleLocation: CircleLocation,
	UserInCircles: UserInCircles
};
