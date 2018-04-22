module.exports = function(app) {
    var calendar = require('./controllerCalendar.js');

    app.route('/calendar/create')
        .post(calendar.createAppointment);

    app.route('/calendar/vote')
        .post(calendar.vote);

    app.route('/calendar/edit')
        .post(calendar.editAppointment);

    app.route('/calendar/getVoting')
        .get(calendar.getVoting);

    app.route('/calendar/getAllAppointments')
        .get(calendar.getAllAppointments);
		
    app.route('/calendar/delete')
        .post(calendar.delete);

};
