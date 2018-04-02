const Sequelize = require('sequelize'),
    sequelize = require('./connection.js');

const ValidationKey = sequelize.define('ValidationKey', {
    userId: Sequelize.STRING,
    validationKey: Sequelize.STRING,
}, {
    timestamps: true
});

module.exports = ValidationKey;