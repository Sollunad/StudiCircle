const constant = require('./constants');
var database = require('./database');
var mailer = require('./mailer');

module.exports = {
    reset: function (mail) {
        var resetId = mailer.generateRandomString(constant.KEY_LENGTH);
        database.setValidationKey(mail, resetId);

        let html = '<html lang="de-DE">\n' +
                        '<head>\n' +
                            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
                        '</head>\n' +
                        '<body>\n' +
                            '<p>\n' +
                                'Please click on following link to reset your password for StuiCircle: <a href="' + constant.getPasswordChangeURL(resetId) + '">Reset my password</a><br/>\n' +
                                'If you did not request a password reset please ignore this mail.' +
                            '</p>' +
                        '</body>\n' +
                    '</html>';

        let subject = 'StudiCircle: Reset your password';

        mailer.sendMail(mail, html, subject);
        console.log("Mail send to: " + mail);

        return true;
    }
}