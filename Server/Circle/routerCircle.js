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

    // id: circleId
    app.route('/circle/remove')
        .post(circle.removeCircle);

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

    // circleID
    // return: Posts of Blackboard
    app.route('/circle/getbbPosts')
        .get(circle.getBlackboardPosts);
};
