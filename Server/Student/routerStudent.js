module.exports = function(app) {
    var user = require('./controllerStudent');

    // user routes
    app.route('/user/register')
        .post(user.register);

    app.route('/user/:validationKey/activate')
        .get(user.activate);

    app.route('/user/forgotPassword')
        .post(user.forgotPassword);

    app.route('/user/:validationKey/resetPassword')
        .post(user.resetPassword);

    app.route('/user/login')
        .post(user.login);

    app.route('/user/setPassword')
        .post(user.setPassword);

    app.route('/user/delete')
        .post(user.deleteAccount);

    app.route('/user/updateMail')
        .post(user.updateMail);

    app.route('/user/:validationKey/changeMail')
        .post(user.confirmNewMail);

    app.route('/user/test')
        .get(user.test);

    app.route('/user/*')
        .get(user.unknownpage);

    app.route('/*')
        .get(user.unknownpage);
};