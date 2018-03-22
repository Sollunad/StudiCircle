var mailer = require('./mailer');
var database = require('./database');
module.exports = {
    register: function (mail, password, accountType, res) {
        html = '<html lang="de-DE">\n' +
            '<head>\n' +
            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
            '</head>\n' +
            '<body>\n' +
            '<p>Please click on following link to register to StudiCircle: <a href="http://localhost:8080/activateNewUser">Validate E-Mail</a></p>' +
            '</body>\n' +
            '</html>';
        subject = 'StudiCircle: Validate your mail address';

        let randomString = this.generateRandomString(48);

        //insert userdata in database
        database.insertNewPerson(mail, password, accountType, randomString);

        //send registration Mail
        mailer.sendMail(mail, html, subject, 'Error at sending verification link.', 'Send verification link.',res);
    },
    generateRandomString: function (length) {
        var Crypto = require('crypto');
        return Crypto.randomBytes(length).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    }
};