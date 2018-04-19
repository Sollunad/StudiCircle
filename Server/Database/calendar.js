const Sequelize = require('sequelize'),
    sequelize = require('./connection.js');

/**
 * Appointments for Circles.
 */
const Appointment = sequelize.define('Appointment', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    location: Sequelize.STRING, // opt. connect to Location entity
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    allDay: Sequelize.BOOLEAN
}, {
    timestamps: true
});

/**
 * Vote for Appointment.
 * "Ich bräuchte da noch ne db Tabelle mit userId (foreign),
 * Vote, und appointment ID (foreign) um das zu lösen."
 *
 * Integer indicates the vote.
 *  0 = rejection
 *  1 = interested
 *  2 = commit
 */
const Vote = sequelize.define('Vote', {
    vote: Sequelize.TINYINT
}, {
    timestamps: true
})

module.exports = {
    Appointment: Appointment,
    Vote: Vote,
    init: function () {
        this.Appointment.sync().then(() => {
            this.Vote.sync();
        });
    }
};