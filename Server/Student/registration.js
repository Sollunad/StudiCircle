var mailer = require('./mailer');
var database = require('./database');
const constant = require('./constants');

module.exports = {
    register: function (mail, password, accountType, res) {

        if (!mail || !password || !accountType || !res) {
            res.send("Error: Null pointer.");
            return;
        }

        if (!this.checkMailAddress(mail)) {
            res.send("Invalid eMail entered.");
            return;
        }

        if (accountType != constant.AccountType.BUSINESS && accountType != constant.AccountType.GUEST && accountType != constant.AccountType.STUDENT ) {
            res.send("Invalid account type entered.");
            return;
        }

        if (password.length < 6 || password.length > 24) {
            res.send("Password length is not between 6 and 24 characters.");
            return;
        }
        let result = "";
        let counter = 10;
        while (result != "ok" && counter > 0) {
            counter--;
            let randomString = this.generateRandomString(48);
            html = '<html lang="de-DE">\n' +
                '<head>\n' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
                '</head>\n' +
                '<body>\n' +
                '<p>Please click on following link to register to StudiCircle: <a href="http://localhost:8080/' + randomString + '/activate">Validate E-Mail</a></p>' +
                '</body>\n' +
                '</html>';
            subject = 'StudiCircle: Validate your mail address';

            //insert userdata in database
            result = database.insertNewPerson(mail, password, accountType, randomString);
            if (result == "ok"){
                break;
            }
            //errors
            if (result == "duplicateMail"){
                res.send("Mail address already registered.");
            }
            if (result == "invalidPwd"){
                res.send("Invalid password entered.");
            }
            if (result == "invalidAccountType"){
                res.send("Error at account type.");
            }
            if (result == "randomExisting"){
                console.log("Random string already exists.");
            }
        }

        //send registration Mail
        mailer.sendMail(mail, html, subject, 'Error at sending verification link.', 'Send verification link.',res);
    },
    generateRandomString: function (length) {
        var Crypto = require('crypto');
        return Crypto.randomBytes(length).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    },
    
    checkMailAddress: function (mail) {
        var validator = require("email-validator");
        return validator.validate(mail);
    }
};