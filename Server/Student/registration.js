const constant = require('./constants');
var db = require('../Database/database');
var mailer = require('./mailer');
const passwordUtil = require('./passwordCheck');

module.exports = {


    registerBusiness: function (mail, password, userName, businessDescription, res) {

        let result = "";
        let randomString = mailer.generateRandomString(constant.KEY_LENGTH);
        html = '<html lang="de-DE">\n' +
                '<head>\n' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
                '</head>\n' +
                '<body>\n' +
                '<h1>Validation of new business account "' + userName + '"</h1>'+
                '<p>There´s a new user "' + userName + '".</p> '+
                '<p>The business description of the new user is:</p>'+
                '<p>' + businessDescription + '</p>'+
                '<p>The mail address is: ' + mail + '</p>'+
                '<p>Please click on following link to activate this account on StudiCircle: <a href="' + constant.getActivationURL(randomString) + '">Validate new account</a></p>' +
                '</body>\n' +
                '</html>';
        subject = 'StudiCircle: Validate new business account';

        var userAuthData = passwordUtil.generateUserAuthData(password);
        var hash = userAuthData.hash;
        var salt = userAuthData.salt;


        try {
                db.User.create({
                    name: userName,
                    email: mail,
                    pwdHash: password,
                    salt:salt,
                    type:constant.AccountType.BUSINESS,
                    state:constant.AccountState.PENDING
                }).then( (user)=> {
                    db.ValidationKey.create({
                        validationKey: randomString
                    }).then( validationKey => {
                        validationKey.setUser(user);
                        mailer.sendMail('studicircle@web.de', html, subject)
                            .then(resp => {
                                console.log(resp);
                                if (res){
                                    res.send({
                                        httpStatus: 200,
                                        message:  "Activation link sent"
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
                                        message:  "Error at sending activation link."
                                    });
                                }
                                return false;
                            });
                    }).error( err =>{
                        res.status(409);
                        res.send({
                            httpStatus: 409,
                            message:  "Database error"
                        });
                        return err;
                    });
                }).error(err => {
                    res.status(409);
                    res.send({
                        httpStatus: 409,
                        message:  "Database error"
                    });
                    return err;
                });
            } catch (err) {
                res.status(409);
                res.send({
                    httpStatus: 409,
                    message:  "Database error"
                });
                return err;
            }



/*
            //insert userdata in database
            result = database.insertNewPerson(mail, userName ,hash, salt, constant.AccountType.BUSINESS, randomString);
            if (result === "ok"){
                break;
            }else if (res) {
                //errors
                if (result === "duplicateMail") {

                    res.status(409);
                    res.send({
                        httpStatus: 409,
                        message:  "Mail address already registered more than 3 times."
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
        }*/

        //send registration Mail

    },

    register: function (mail, password, accountType, userName, res, businessDescription) {

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

        let passwordCheck = passwordUtil.passwordIsCompliant(password);
        if (!passwordCheck){
            if (res){
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message:  "wrong passsword"
                });
            }
            return "wrong password";
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

        if ( accountType == constant.AccountType.BUSINESS ){
            return this.registerBusiness(mail,password,userName,businessDescription,res);
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

            var userAuthData = passwordUtil.generateUserAuthData(password);
            var hash = userAuthData.hash;
            var salt = userAuthData.salt;

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

};