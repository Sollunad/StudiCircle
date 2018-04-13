const Sequelize = require('sequelize');
const sequelize = require('./connection.js');

const User = require('./user.js');
const Circle = require('./circle.js');
const Location = require('./location.js');
const ValidationKey = require('./validationKey');
const UniMail = require('./uniMail');
const ChatMessage = require('./chat.js');
const Blackboard = require('./blackboard.js');

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
 * 1:n - USER AND CHAT ChatMessage
 * 1:n - CIRCLE AND CHAT ChatMessage
 **/
Circle.hasMany(ChatMessage);
User.hasMany(ChatMessage);
ChatMessage.belongsTo(User);
ChatMessage.belongsTo(Circle);

/**
 * 1:m - CIRCLES AND MODULES
 **/
/*Circle.hasMany(Module);
Module.belongsTo(Circle);*/

/**
 * 0/1:1 - USER AND VALIDATIONKEY
 **/
//User.has(ValidationKey);
ValidationKey.belongsTo(User);



/**
 * Blackboard
 * 1:n - POST AND USER
 * 1:n - POST AND CIRCLE
 **/
User.hasMany(Blackboard.Post);
Blackboard.Post.belongsTo(User);

Circle.hasMany(Blackboard.Post);
Blackboard.Post.belongsTo(Circle);

/**
 * Blackboard
 * 1:n - COMMENT AND USER
 * 1:n - COMMENT AND POST
 **/
User.hasMany(Blackboard.Comment);
Blackboard.Comment.belongsTo(User);

Blackboard.Post.hasMany(Blackboard.Comment);
Blackboard.Comment.belongsTo(Blackboard.Post);


/** in der Node-Konsole aufrufen um die Tabellen zu erzeugen/upzudaten (das gehört in den Duden) */
function init() {
	console.log("Database init");
	User.sync({force:true}).then(() => {
		ValidationKey.sync({force:true});
        UniMail.sync({force:true});
		Circle.sync({force:true}).then(() => {
			ChatMessage.sync({force:true}).then(() => {
				Location.sync({force:true}).then(() => {
					CircleLocation.sync({force:true});
					UserInCircles.sync({force:true});
					Blackboard.init();
                    console.log("Database done");
				});
			});
		});
	});
}

module.exports = {
	init: init,
	Circle: Circle,
	Location: Location,
	User: User,
	Blackboard: Blackboard,
	ValidationKey: ValidationKey,
	UniMail:UniMail,
	ChatMessage: ChatMessage,
	CircleLocation: CircleLocation,
	UserInCircles: UserInCircles
};
