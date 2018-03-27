module.exports = function(app) {
    var circle = require('./controllerCircle');

    // circle routes
    app.route('/circle/helloworld')
        .get(circle.helloworld);

    // userId
    // circleId
    app.route('/circle/removeUser')
        .post(circle.removeUser);

    // circleId
    // userId
    app.route('/circle/addUser')
        .post(circle.addUser);

    // name: circle name
    // vis: visible
    // loc: location{long,lat}
    app.route('/circle/new')
        .post(circle.newCircle);

    // id: circleId
    app.route('/circle/remove')
        .post(circle.removeCircle);

    // id: userId
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
};
