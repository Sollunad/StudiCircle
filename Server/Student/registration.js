var mailer = require('./mailer');
var database = require('./database');
const constant = require('./constants');
const crypto = require('crypto');

module.exports = {
    register: function (mail, password, accountType, res) {

        if (!mail || !password || !accountType ) {
            if (res) {
                res.status(400);
                res.send("Error: Null pointer.");
            }
            return "null";
        }

        if (!mailer.checkMailAddress(mail)) {
            if (res) {
                res.status(400);
                res.send("Invalid eMail entered.");
            }
            return "invalidMail";
        }

        if (accountType != constant.AccountType.BUSINESS && accountType != constant.AccountType.GUEST && accountType != constant.AccountType.STUDENT ) {
            if (res) {
                res.status(400);
                res.send("Invalid account type entered.");
            }
            return "invalidAccountType";
        }

        if (password.length < 6 || password.length > 24) {
            if (res){
                res.status(400);
                res.send("Password length is not between 6 and 24 characters.");
            }
            return "wrongPwd";
        }
        let result = "";
        let counter = 10;
        while (result !== "ok" && counter > 0) {
            counter--;
            let randomString = mailer.generateRandomString(constant.KEY_LENGTH);
            let url = constant.getActivationUrl(randomString);
            html = '<html lang="de-DE">\n' +
                '<head>\n' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
                '</head>\n' +
                '<body>\n' +
                '<p>Please click on following link to register to StudiCircle: <a href="'+ url + '">Validate E-Mail</a></p>' +
                '</body>\n' +
                '</html>';
            subject = 'StudiCircle: Validate your mail address';

            var salt = this.generateSalt()
            var userValue = salt + password;
            var hash = crypto.createHash('sha256').update(userValue, 'utf8').digest('hex');

            //insert userdata in database
            result = database.insertNewPerson(mail, hash, salt, accountType, randomString);
            if (result === "ok"){
                break;
            }else if (res) {
                //errors
                if (result === "duplicateMail") {
                    res.status(400);
                    res.send("Mail address already registered.");
                    return result;
                }
                if (result === "invalidPwd") {
                    res.status(400);
                    res.send("Invalid password entered.");
                    return result;
                }
                if (result === "invalidAccountType") {
                    res.status(400);
                    res.send("Error at account type.");
                    return result;
                }
            }else{
                return "error";
            }
            if (result === "randomExisting"){
                console.log("Random string already exists.");
            }
        }

        if (result === "randomExisting"){
            if (res){
                res.status(400);
                res.send("Random string already exists.");
            }
            return result;
        }

        //send registration Mail
        mailer.sendMail(mail, html, subject)
            .then(resp => {
                console.log(resp);
                if (res){
                    res.send("Send verification link");
                }
                return true;
            })
            .catch(err => {
                console.log(err);
                if (res){
                    res.status(400);
                    res.send("Error at sending verification link.");
                }
                return false;
            });
    },

    generateSalt : function() {
        return crypto.randomBytes(constant.SALT_LENGTH).toString('base64');
    }
};