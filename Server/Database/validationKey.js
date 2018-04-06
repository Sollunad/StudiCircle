const Sequelize = require('sequelize'),
    sequelize = require('./connection.js');

const ValidationKey = sequelize.define('ValidationKey', {
    validationKey: Sequelize.STRING,
    newMail: Sequelize.STRING,
}, {
    timestamps: true
});

module.exports = ValidationKey;