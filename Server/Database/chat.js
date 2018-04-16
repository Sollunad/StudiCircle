/**
 * [13:58, 5.4.2018] +49 176 30196442: ID
 * [13:58, 5.4.2018] +49 176 30196442: Message
 * [13:59, 5.4.2018] +49 176 30196442: circleId (Fremdschlüssel)
 * [13:59, 5.4.2018] +49 176 30196442: userId(FremdSchlüssel)
 * [13:59, 5.4.2018] +49 176 30196442: time */

const Sequelize = require('sequelize'),
	sequelize = require('./connection.js');
	
const ChatMessage = sequelize.define('ChatMessage', {
	body: Sequelize.TEXT,
	time: Sequelize.DATE
}, {
	timestamps: false
});
module.exports = ChatMessage;