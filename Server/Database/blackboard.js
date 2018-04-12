/**
 * Also wir brauchen ne Tabelle für die Posts auf dem Blackboard.
 * Jeder Post braucht ne eigene ID, 
 * nen Fremdschlüssel zur UserID des Verfassers,
 * Fremdschlüssel zur CicleID,
 * ein Textfeld und
 * ein Timestamp.
 *
 * Die Comments brauchen auch ne Tabelle mit
 * Fremdschlüssel auf den Post
 * und den User,
 * n Textfeld und auch
 * ein Timestamp
 **/
 
const Sequelize = require('sequelize'),
	sequelize = require('./connection.js');

const Post = sequelize.define('Post', {
	body: Sequelize.TEXT
}, {
	timestamps: true
});

const Comment = sequelize.define('Comment', {
	body: Sequelize.TEXT
}, {
	timestamps: true
});

module.exports = {
	Post: Post,
	Comment: Comment,
	init: function () {
		// assuming User and Circle are created:
		this.Post.sync().then(() => {
			this.Comment.sync()
		});
	}
};