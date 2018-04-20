const Sequelize = require('sequelize'),
    sequelize = require('./connection.js');

const Invitation = sequelize.define('Invitation', {
    status: Sequelize.INTEGER,
}, {
    timestamps: true
});
module.exports = Invitation;