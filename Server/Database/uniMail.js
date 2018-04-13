const Sequelize = require('sequelize'),
    sequelize = require('./connection.js');

const uniMail = sequelize.define('uniMail', {
    name: Sequelize.STRING,
    domain: {
        type: Sequelize.STRING,
        unique: true
    }
}, {
    timestamps: false
});
module.exports = uniMail;