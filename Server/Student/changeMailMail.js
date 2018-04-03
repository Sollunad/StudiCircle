const constant = require('./constants');
const database = require('./database');
const mailer = require('./mailer');

module.exports = {
    send: function (oldMail, newMail) {
        var changeId = mailer.generateRandomString(constant.KEY_LENGTH);
        database.setChangeMailKey(oldMail, newMail, changeId);

        let htmlNewMail = '<html lang="de-DE">\n' +
            '<head>\n' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
            '</head>\n' +
            '<body>\n' +
                '<p>\n' +
                    'You requested the change of your Mail. Please confirm the address by clicking the following link <a href="' + constant.getNewMailActivationURL(changeId) + '">Confirm mail address</a><br/>\n' +
                    'If you did not request a change or changed your opinion and do not want to change the mail address please ignore this mail.' +
                '</p>' +
            '</body>\n' +
            '</html>';

        let subjectNewMail = 'StudiCircle: Confirm your new mail address';

        let htmlOldMail = '<html lang="de-DE">\n' +
            '<head>\n' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
            '</head>\n' +
            '<body>\n' +
                '<p>\n' +
                    'You requested the change your mail to "' + newMail + '". A link to confirm that mail address was sent to it directly.<br/>\n' +
                    'If you changed your opinion and do not want to change the mail address please ignore the mail sent to the address mentioned above.<br/>\n' +
                    'If you did not request a change of the address yourself someone probably stole your account information. In that case please contact our customer service.' +
                '</p>' +
            '</body>\n' +
            '</html>';

        let subjectOldMail = 'StudiCircle: You changed you mail address';

        mailer.sendMail(newMail, htmlNewMail, subjectNewMail);
        mailer.sendMail(oldMail, htmlOldMail, subjectOldMail);

        console.log("Mail send to: " + newMail);
        console.log("Mail send to: " + oldMail);

        return true;
    }
}