const Sequelize = require('sequelize');
const sequelize = require('./connection.js');

const User = require('./user.js');
const Circle = require('./circle.js');
const Location = require('./location.js');
const ValidationKey = require('./validationKey');
const UniMail = require('./uniMail');
const ChatMessage = require('./chat.js');
const Blackboard = require('./blackboard.js');
const Invitation = require('./invitation.js');

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

/**
 * Invitation
 * 1:n - INVITATION AND USER
 * 1:n - INVITATION AND CIRCLE
 * (INVITING USER TO CIRCLE)
 **/
User.hasMany(Invitation);
Invitation.belongsTo(User);

Circle.hasMany(Invitation);
Invitation.belongsTo(Circle);



/** in der Node-Konsole aufrufen um die Tabellen zu erzeugen/upzudaten (das gehört in den Duden) */
function init() {
	console.log("Database init, with max. force.");
	saveInit({ force:true });
}

function simpleInit() {
	console.log("Database init, no force.");
	saveInit({});
}

function saveInit(forceObject) {
    User.sync(forceObject).then(() => {
        ValidationKey.sync(forceObject);
        UniMail.sync(forceObject);
        Circle.sync(forceObject).then(() => {
            ChatMessage.sync(forceObject).then(() => {
                Location.sync(forceObject).then(() => {
                    CircleLocation.sync(forceObject);
                    UserInCircles.sync(forceObject);
                    Blackboard.init();
                    Invitation.sync(forceObject);
                    console.log("Database initialization: Done!");
                });
            });
        });
    });
}

module.exports = {
	init: init,
	initSimple: simpleInit,
	Circle: Circle,
	Location: Location,
	User: User,
	Blackboard: Blackboard,
	Invitation: Invitation,
	ValidationKey: ValidationKey,
	UniMail:UniMail,
	ChatMessage: ChatMessage,
	CircleLocation: CircleLocation,
	UserInCircles: UserInCircles
};
