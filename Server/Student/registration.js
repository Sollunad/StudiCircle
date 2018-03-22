module.exports = {
    register: function (mail, pwd, accountType,res) {
        html = '<html lang="de-DE">\n' +
            '<head>\n' +
            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
            '</head>\n' +
            '<body>\n' +
            '<p>Please click on following link to register to Studicircle: <a href="http://localhost:8080/test">Validate E-Mail</a></p>' +
            '</body>\n' +
            '</html>';
        subject = 'Studicircle: Validate Your mail address';

        let randomString = this.generateRandomString(48);

        //insert userdata in database
        // account state = onValidation
        //db.insertNewPerson(mail,pwd,accountType,randomString);

        console.log(randomString);
        //send registration Mail
        var mailer = require('./mailer');
        mailer.sendMail(mail, html, subject, 'Error at sending verification link.', 'Send verification link.',res);
    },
    generateRandomString: function (length) {
        var Crypto = require('crypto');
        return Crypto.randomBytes(length).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    }
};