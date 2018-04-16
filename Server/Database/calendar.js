const Sequelize = require('sequelize'),
    sequelize = require('./connection.js');

const Appointment = sequelize.define('Appointment', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    location: Sequelize.STRING, // opt. connect to Location entity
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    allDay: Sequelize.BOOLEAN,
    countCommits: Sequelize.INTEGER,
    countRejections: Sequelize.INTEGER,
    countInterested: Sequelize.INTEGER
}, {
    timestamps: true
});

module.exports = {
    Appointment: Appointment,
    init: function () {
        this.Appointment.sync();
    }
};