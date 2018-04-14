const constant = require('./constants');
var db = require('../Database/database');
var database = require('../Student/database');
var mailer = require('./mailer');
const passwordUtil = require('./passwordCheck');

module.exports = {

    registerBusiness: function (mail, password, userName, businessDescription, res) {

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
                '<p>Please click on following link to cancel the activitation / invitation of this account on StudiCircle: <a href="' + constant.getDeactivationURL(randomString) + '">Disable new account</a></p>' +
                '</body>\n' +
                '</html>';
        subject = 'StudiCircle: Validate new business account';

        var userAuthData = passwordUtil.generateUserAuthData(password);
        var hash = userAuthData.hash;
        var salt = userAuthData.salt;


        try {
                return db.User.create({
                    name: userName,
                    email: mail,
                    pwdHash: hash,
                    salt:salt,
                    type:constant.AccountType.BUSINESS,
                    state:constant.AccountState.PENDING
                }).then( (user)=> {
                    db.ValidationKey.create({
                        validationKey: randomString
                    }).then( validationKey => {
                        validationKey.setUser(user);
                        return mailer.sendMail('studicircle@web.de', html, subject)
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

    },

    register: async function (mail, password, accountType, userName, res, businessDescription) {

        if (!mail || !password || !accountType || !userName) {
            if (res) {
                res.status(417);
                res.send({
                    httpStatus: 417,
                    message: "Expectation Failed"
                });
            }
            return "null";
        }

        if (!mailer.checkMailAddress(mail)) {
            if (res) {
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message: "Invalid eMail entered."
                });
            }
            return "invalidMail";
        }

        if (accountType != constant.AccountType.BUSINESS && accountType != constant.AccountType.GUEST && accountType != constant.AccountType.STUDENT) {
            if (res) {
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message: "Invalid account type entered."
                });
            }
            return "invalidAccountType";
        }

        let passwordCheck = passwordUtil.passwordIsCompliant(password);
        if (!passwordCheck) {
            if (res) {
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message: "wrong passsword"
                });
            }
            return "wrong password";
        }

        if (userName.length < constant.USERNAME_MIN_LENGTH || userName.length > constant.USERNAME_MAX_LENGTH) {
            if (res) {
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message: "User name length is not between " + constant.USERNAME_MIN_LENGTH + " and " + constant.USERNAME_MAX_LENGTH + " characters."
                });
            }
            return "wrong username";
        }

        if (accountType == constant.AccountType.BUSINESS) {
            return this.registerBusiness(mail, password, userName, businessDescription, res);
        }

        try{
            await database.checkStudentMail(mail);
        } catch (err) {
            console.log(err);
            if (res) {
                res.status(412);
                res.send({
                    httpStatus: 412,
                    message: mail + " in not a known valid mail address."
                });
            }
            return false;
        }

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


        try {
            return db.User.create({
                name: userName,
                email: mail,
                pwdHash: hash,
                salt: salt,
                type: constant.AccountType.STUDENT,
                state: constant.AccountState.PENDING
            }).then((user) => {
                db.ValidationKey.create({
                    validationKey: randomString
                }).then(validationKey => {
                    validationKey.setUser(user);
                    return mailer.sendMail(mail, html, subject)
                        .then(resp => {
                            console.log(resp);
                            if (res) {
                                res.send({
                                    httpStatus: 200,
                                    message: "Activation link sent"
                                });
                            }
                            return true;
                        })
                        .catch(err => {
                            console.log(err);
                            if (res) {
                                res.status(412);
                                res.send({
                                    httpStatus: 412,
                                    message: "Error at sending activation link."
                                });
                            }
                            return false;
                        });
                }).error(err => {
                    res.status(409);
                    res.send({
                        httpStatus: 409,
                        message: "Database error"
                    });
                    return err;
                });
            }).error(err => {
                res.status(409);
                res.send({
                    httpStatus: 409,
                    message: "Database error"
                });
                return err;
            });
        } catch (err) {
            res.status(409);
            res.send({
                httpStatus: 409,
                message: "Database error"
            });
            return err;
        }
    },

    registrationInform : async function ( validationKey, message){
        console.log("test1");
        try {
            console.log("test1");
            let userId = await database.getUserIdFromValidationKey( validationKey);
            console.log("inform3");
            let userData = await database.getUserData(userId);
            console.log("inform");
            console.log(userData.username);
            let html = '<html lang="de-DE">\n' +
                '<head>\n' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
                '</head>\n' +
                '<body>\n' +
                '<h1>Validation of your new business account "' + userData.username + '"</h1>' +
                '<p>' + message + '</p> ' +
                '</body>\n' +
                '</html>';
            let subject = 'StudiCircle: Validation of your new business account';
            await mailer.sendMail(userData.mail, html, subject);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};