module.exports = function(app) {
    var circle = require('./controllerCircle.js');

    // circle routes
    app.route('/circle/helloworld')
        .get(circle.helloworld);

    // userId
    // circleId
    app.route('/circle/removeUser')
        .post(circle.removeUser);

    // circleId
    // userId
    app.route('/circle/joinOpen')
        .post(circle.joinOpenCircle);

    // name: circle name
    // vis: true/false
    app.route('/circle/new')
        .post(circle.newCircle);

    // name: circle name
    // vis: true/false
    app.route('/circle/edit')
        .post(circle.editCircle);

    // calendar: true/false
    // bill = true/false
    // bet = true/false
    // file = true/false
    // market = true/false
    app.route('/circle/editModules')
        .post(circle.editModules);

    // id: circleId
    app.route('/circle/remove')
        .post(circle.removeCircle);

	// id (Number): current circle
	// user (Number): selected users id
	// role (String): admin | member | mod for selected user
	app.route('/circle/changeRole')
		.post(circle.changeRole);

    // return: List circles
    app.route('/circle/forUser')
        .get(circle.circlesForUserId);

    // loc: location{long,lat}
    // return: List circles
    app.route('/circle/forLocation')
        .get(circle.circlesForLocation);

    // id: circleId
    // return: List users
    app.route('/circle/members')
        .get(circle.members);

    // circleId: circleId
    // return: List of active modules for given circle
    app.route('/circle/modules')
        .get(circle.getModules);

    // circleId: circleId
    // return: visibility for circle
    app.route('/circle/getVisibility')
        .get(circle.getVisibility);

    // circleId (Number): current circle
	// userId (Number): selected users id
	app.route('/circle/newAdmin')
		.post(circle.newAdmin);

    // circleId (Number): current circle
    app.route('/circle/getRole')
        .get(circle.getRole);

    // userId (Number): selected users id
	app.route('/circle/leave')
		.post(circle.leaveCircle);

    // userId (Number): selected users id
    app.route('/circle/leave')
        .post(circle.leaveCircle);
  
    app.route('/circle/invite')
        .post(circle.inviteToCircle);

    app.route('/circle/getInvitForUser')
        .get(circle.allInvitationsPerUser);

    app.route('/circle/answerInvit')
        .post(circle.reactToInvitation);

    //app.route('/circle/getInvitForCircle')
       //.get(circle.allInvitationsPerCircle);

    app.route('/circle/deleteInvit')
        .post(circle.deleteInvitation);
};
