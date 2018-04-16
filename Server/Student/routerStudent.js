module.exports = function(app) {
    var user = require('./controllerStudent');

    // user routes
    app.route('/user/register')
        .post(user.register);

    app.route('/user/activate/:validationKey')
        .get(user.activate);

    app.route('/user/disable/:validationKey')
        .get(user.disableInvitation);

    app.route('/user/forgotPassword')
        .post(user.forgotPassword);

    app.route('/user/resetPassword')
        .post(user.resetPassword);

    app.route('/user/resetPassword/:validationKey')
        .get(user.passwordResetPage);

    app.route('/user/login')
        .post(user.login);

    app.route('/user/logout')
        .get(user.logout)
        .post(user.logout);

    app.route('/user/setPassword')
        .post(user.setPassword);

    app.route('/user/deleteUser')
        .post(user.deleteAccount);

    app.route('/user/updateMail')
        .post(user.updateMail);

    app.route('/user/changeMail/:validationKey')
        .get(user.confirmNewMail);

    app.route('/user/guest/register/:validationKey')
        .get(user.registerGuest);

    app.route('/user/guest/activate')
        .post(user.activateGuest);

    app.route('/user/test')
        .get(user.test);

    app.route('/user/trigger')
        .get(user.trigger);

    app.route('/user/*')
        .get(user.unknownpage);
    // weil die Sockets erst später definiert werden, ist das hier scheiße... wenn überhaupt sollte so eine Regel in einer
    // extra Datei ganz am Ende sein und nicht in routerStudent
  
    // app.route('/*')
    //     .get(user.unknownpage);
};
