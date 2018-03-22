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
        var mailer = require('./mailer');
        mailer.sendMail(mail, html, subject, 'Error at sending verification link.', 'Send verification link.',res);
    }
};