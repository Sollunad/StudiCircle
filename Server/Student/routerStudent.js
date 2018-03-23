module.exports = function(app) {
    var user = require('./controllerStudent');

    // user routes
    app.route('/user/register')
        .post(user.register);

    app.route('/user/:uuid/changePassword')
        .get(user.changePassword);

    app.route('/user/forgotPassword')
        .post(user.forgotPassword);

    app.route('/user/:uuid/activate')
        .get(user.activate);

    app.route('/user/*')
        .get(user.helloworld);

    app.route('/*')
        .get(user.unknownpage);
};