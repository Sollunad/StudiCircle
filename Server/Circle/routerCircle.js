module.exports = function(app) {
    var circle = require('./controllerCircle');

    // circle routes
    app.route('/circle/helloworld')
        .get(circle.helloworld);

    // id: userId
    app.route('/circle/removeUser')
        .post(circle.removeUser);

    // id: userId
    app.route('/circle/addUser')
        .post(circle.addUser);

    // name: circle name
    // loc: location
    app.route('/circle/new')
        .post(circle.newCircle);

    // id: circleId
    app.route('/circle/remove')
        .post(circle.removeCircle);

    // id: userId
    // return: List circles
    app.route('/circle/forUser')
        .get(circle.circlesForUserId);

    // loc: location
    // return: List circles
    app.route('/circle/forLocation')
        .get(circle.circlesForLocation);
};
