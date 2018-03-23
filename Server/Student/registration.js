var mailer = require('./mailer');
var database = require('./database');
const constant = require('./constants');

module.exports = {
    register: function (mail, password, accountType, res) {

        if (!mail || !password || !accountType || !res) {
            res.send("Error: Null pointer.");
            return "null";
        }

        if (!mailer.checkMailAddress(mail)) {
            res.send("Invalid eMail entered.");
            return "invalidMail";
        }

        if (accountType != constant.AccountType.BUSINESS && accountType != constant.AccountType.GUEST && accountType != constant.AccountType.STUDENT ) {
            res.send("Invalid account type entered.");
            return "invalidAccountType";
        }

        if (password.length < 6 || password.length > 24) {
            res.send("Password length is not between 6 and 24 characters.");
            return "wrongPwd";
        }
        let result = "";
        let counter = 10;
        while (result !== "ok" && counter > 0) {
            counter--;
            let randomString = mailer.generateRandomString(constant.KEY_LENGTH);
            html = '<html lang="de-DE">\n' +
                '<head>\n' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
                '</head>\n' +
                '<body>\n' +
                '<p>Please click on following link to register to StudiCircle: <a href="http://localhost:8080/user/' + randomString + '/activate">Validate E-Mail</a></p>' +
                '</body>\n' +
                '</html>';
            subject = 'StudiCircle: Validate your mail address';

            //insert userdata in database
            result = database.insertNewPerson(mail, password, accountType, randomString);
            if (result === "ok"){
                break;
            }
            //errors
            if (result === "duplicateMail"){
                res.send("Mail address already registered.");
                return result;
            }
            if (result === "invalidPwd"){
                res.send("Invalid password entered.");
                return result;
            }
            if (result === "invalidAccountType"){
                res.send("Error at account type.");
                return result;
            }
            if (result === "randomExisting"){
                console.log("Random string already exists.");
            }
        }

        if (result === "randomExisting"){
            res.send("Random string already exists.");
            return result;
        }

        //send registration Mail
        mailer.sendMail(mail, html, subject)
            .then(resp => {
                console.log(resp);
                res.send("Send verification link");
                return true;
            })
            .catch(err => {
                console.log(err);
                res.send("Error at sending verification link.");
                return false;
            });
    }
};