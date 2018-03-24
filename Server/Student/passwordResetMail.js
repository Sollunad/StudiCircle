const constant = require('./constants');
var database = require('./database');
var mailer = require('./mailer');

module.exports = {
    reset: function (user) {
        var uuid = mailer.generateRandomString(constant.KEY_LENGTH);
        database.setValidationKey(user, uuid);

        var mail = database.getUserData(user).mail;

        let html = '<html lang="de-DE">\n' +
                        '<head>\n' +
                            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
                        '</head>\n' +
                        '<body>\n' +
                            '<p>Please click on following link to register to reset your password for StuiCircle: <a href="http://localhost:8100/forgotPassword/' + randomString + '">Validate E-Mail</a></p>' +
                        '</body>\n' +
                    '</html>';

        let subject = 'StudiCircle: Reset your password';

        mailer.sendMail(mail, html, subject);

        return true;
    }
}