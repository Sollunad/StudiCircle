module.exports = function(app) {
    var user = require('./controllerStudent');

    // user routes
    app.route('/user/register')
        .post(user.register);

    app.route('/user/:validationKey/resetPassword')
        .post(user.resetPassword);

    app.route('/user/:validationKey/activate')
        .get(user.activate);

    app.route('/user/setPassword')
        .post(user.setPassword);

    app.route('/user/forgotPassword')
        .post(user.forgotPassword);

    app.route('/user/login')
        .post(user.login)

    app.route('/user/test')
        .get(user.test);

    app.route('/user/*')
        .get(user.helloworld);

    app.route('/*')
        .get(user.unknownpage);
};