var validator = require("email-validator");

module.exports = {
    checkMailAddress: function (mail) {
        return validator.validate(mail);
    },
    generateRandomString: function (length) {
        var Crypto = require('crypto');
        return Crypto.randomBytes(length).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    },
    sendMail: function (mailAddress, htmlcontent, subject) {
        var nodeMailer = require('nodemailer');
        var mailPassword = process.env.StudicircleMailPwd;

        var smtpConfig = {
            host: 'smtp.web.de',
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: 'studicircle@web.de',
                pass: mailPassword
            }
        };

        var transporter = nodeMailer.createTransport(
            smtpConfig
        );

        var mailOptions = {
            from: 'StudiCircle <studicircle@web.de>',
            to: mailAddress,
            subject: subject,
            html: htmlcontent
        };

        return new Promise(function(resolve, reject) {
            return transporter.sendMail(mailOptions, function (error, info) {
                if(error){
                    reject(error);
                }
                resolve(info)
            });
        });
    }
}