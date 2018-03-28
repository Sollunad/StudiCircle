var mailer = require('./mailer');
var database = require('./database');
const constant = require('./constants');
const crypto = require('crypto');

module.exports = {
    register: function (mail, password, accountType, userName, res) {

        if (!mail || !password || !accountType || !userName ) {
            if (res) {
                res.status(417);
                res.send({
                    httpStatus: 417,
                    message:  "Expectation Failed"
                });
            }
            return "null";
        }

        if (!mailer.checkMailAddress(mail)) {
            if (res) {
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message:  "Invalid eMail entered."
                });
            }
            return "invalidMail";
        }

        if (accountType != constant.AccountType.BUSINESS && accountType != constant.AccountType.GUEST && accountType != constant.AccountType.STUDENT ) {
            if (res) {
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message:  "Invalid account type entered."
                });
            }
            return "invalidAccountType";
        }

        if (password.length < constant.PASS_MIN_LENGTH || password.length > constant.PASS_MAX_LENGTH) {
            if (res){
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message:  "Password length is not between " + constant.PASS_MIN_LENGTH + " and "+ constant.PASS_MAX_LENGTH +" characters."
                });
            }
            return "wrongPwd";
        }

        if (userName.length < constant.USERNAME_MIN_LENGTH || userName.length > constant.USERNAME_MAX_LENGTH) {
            if (res){
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message:  "User name length is not between " + constant.USERNAME_MIN_LENGTH + " and " + constant.USERNAME_MAX_LENGTH + " characters."
                });
            }
            return "wrong username";
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
                '<p>Please click on following link to register to StudiCircle: <a href="' + constant.getActivationURL(randomString) + '">Validate E-Mail</a></p>' +
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

                    res.status(409);
                    res.send({
                        httpStatus: 409,
                        message:  "Mail address already registered."
                    });
                    return result;
                }
                if (result === "duplicateUsername") {

                    res.status(409);
                    res.send({
                        httpStatus: 409,
                        message:  "User name already registered."
                    });
                    return result;
                }
                if (result === "invalidPwd") {
                    res.status(400);
                    res.send({
                        httpStatus: 400,
                        message:  "Invalid password entered."
                    });
                    return result;
                }
                if (result === "invalidAccountType") {
                    res.status(400);
                    res.send({
                        httpStatus: 400,
                        message:  "Error at account type."
                    });
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
                res.status(418);
                res.send({
                    httpStatus: 418,
                    message:  "10 random generated strings already exist."
                });
            }
            return result;
        }

        //send registration Mail
        mailer.sendMail(mail, html, subject)
            .then(resp => {
                console.log(resp);
                if (res){
                    res.send({
                        httpStatus: 200,
                        message:  "Verification link sent"
                    });
                }
                return true;
            })
            .catch(err => {
                console.log(err);
                if (res){
                    res.status(412);
                    res.send({
                        httpStatus: 412,
                        message:  "Error at sending verification link."
                    });
                }
                return false;
            });
    },

    generateSalt : function() {
        return crypto.randomBytes(constant.SALT_LENGTH).toString('base64');
    }
};