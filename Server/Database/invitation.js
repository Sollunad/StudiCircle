const Sequelize = require('sequelize'),
    sequelize = require('./connection.js');

const Invitation = sequelize.define('Invitation', {}, {
    timestamps: true
});
module.exports = Invitation;