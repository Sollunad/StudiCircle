const changeMail = require('./changeMailMail');
const constants = require('./constants');
const database = require('./database');
const db = require('../Database/database');
const passwordResetForm = require('./passwordResetForm');
const passwordUtil = require('./passwordCheck');
const registration = require('./registration');
const resetPwd = require('./passwordResetMail');
const mySession = require('../Session/session');
const tests = require('./tests');

module.exports = {

    //Called when a user wants to create an account
    //Will send a validation Mail
    register : function (req, res) {
        let mailAddress = req.body.mail;
        let password = req.body.pwd;
        let accountType = req.body.type;
        let userName = req.body.username;
        let businessDescription = req.body.businessdescription;
        registration.register(mailAddress, password, accountType, userName, res, businessDescription);
    },

    //Called when user clicks the link in the validation Mail.
    activate : function (req, res) {
        var validationKey = req.params.validationKey;

        if (!validationKey) {
            res.status(400);
            res.send("Bad request. No uuid.");
            return;
        }

        try {
            if (database.validationKeyExists(validationKey)) {
                database.setState(validationKey, constants.AccountState.ACTIVE);
                res.status(201);
                res.send("Successfully validated new user account.");
            } else {
                res.status(401);
                res.send("Unauthorized. Invalid validation key.");
            }
        } catch (err) {
            res.status(500);
            res.send("Server Error");
        }
    },

    //Called when user requests a Mail to reset her/his password
    forgotPassword: function (req, res) {
        var mail = req.body.mail;

        if (!mail) {
            res.status(400);
            res.send("Bad request. No mail.");
            return;
        }

        try {
            if (database.userMailExists(mail)) {
                resetPwd.reset(mail);
            }
            res.status(200);
            res.send("Reset mail sent if user is known.");
        } catch (err) {
            console.log(err);
            res.status(500);
            res.send("Server Error");
        }
    },

    passwordResetPage : function (req, res) {
        var validationKey = req.params.validationKey;
        if (!validationKey) {
            res.status(400);
            res.send("Bad request. No validation key");
            return;
        } else {
            res.status(200);
            res.send(passwordResetForm.getForm(validationKey));
        }
    },

    //Called when user sends a new Password after requesting a password reset mail using the client
    resetPassword : function (req, res) {
        var validationKey = req.params.validationKey;
        var newPassword = req.body.pwd;

        console.log(validationKey + " | " + newPassword);

        if (!validationKey || !newPassword) {
            res.status(400);
            res.send("Bad request. No validation key or password.");
            return;
        }

        try {
            if (database.validationKeyExists(validationKey)) {
                var userId = database.getUserIdFromValidationKey(validationKey);

                var userAuthData = passwordUtil.generateUserAuthData(newPassword);
                var hash = userAuthData.hash;
                var salt = userAuthData.salt;

                database.setPassword(userId, hash, salt);

                res.status(200);
                res.send("Password successfully reset.");
            } else {
                res.status(401);
                res.send("Invalid validation key!");
            }
        } catch (err) {
            console.log(err);
            res.status(500);
            res.send("Server Error");
        }
    },

    //Called when the user wants to login to studiCircle. Will send session an d user data if credentials are valid
    login : function (req, res) {
        var mail = req.body.mail;
        var pass = req.body.pwd;

        if (!mail || !pass) {
            res.status(400);
            res.send("Bad request. Either no username or no password.");
            return;
        }

        try {
            db.User.findAll({ where:{ 'email': mail }}).then(user1 => { // get id by mail
                if ( user1 &&  user1[0] && user1[0].dataValues.id){
                    let userId =  user1[0].dataValues.id;
                    console.log("User ID" + userId);
                    userId = 3;
                    console.log("User ID" + userId);
                    db.User.findById(userId).then(user => {
                        let userAuthData ={"id":userId, "username": user.dataValues.name, "mail": user.dataValues.email, "type": user.dataValues.type, "state": user.dataValues.state, "businessDescription": user.dataValues.businessDescription, "lastActivity": user.dataValues.lastActivity};
                        let testausgabe=  pass + " : " + userAuthData.salt + " hash " + userAuthData.hash;
                         if (passwordUtil.passwordCorrect(pass, userAuthData.salt, userAuthData.hash)) {
                            var returnObject = {};
                            returnObject.status = 200;
                            returnObject.message = "Successfully Logged in";
                            returnObject.userData = database.getUserData(userId);

                            returnObject.session = mySession.generateSession(userId);

                            res.status(200);
                            res.send(returnObject);
                        } else {
                            res.status(401);
                            res.send('Unauthorized! password util' + testausgabe);
                        }
                    }).error(err => {
                        res.status(402);
                        res.send('Unauthorized! Controller Student' + testausgabe);
                    });
                }else {
                    res.status(403);
                    res.send('Unauthorized! Controller Student' + testausgabe);
                }
            }).error(err => {
                res.status(404);
                res.send('Unauthorized! Controller Student' + testausgabe);
            });

        } catch (err) {
            console.log(err)
            res.status(500);
            res.send("Server Error");
        }
    },

    logout : function (req, res) {
        req.session.reset();
        res.send("Logout successfull.")
    },

    //Called when the user sets a new password
    setPassword : function (req, res) {

        var userId = req.session.userId
        var oldPw = req.body.oldPwd;
        var newPw = req.body.newPwd;

        if (!userId || !oldPw || !newPw || !passwordUtil.passwordIsCompliant(newPw)) {
            res.status(400);
            res.send("Bad request. No session, old or new password not set or not compliant to guidelines.");
            return;
        }

        try {
            var userAuthData = database.getUserAuthData(userId);

            if (passwordUtil.passwordCorrect(oldPw, userAuthData.salt, userAuthData.hash)) {
                var newUserAuthData = passwordUtil.generateUserAuthData(newPw);
                database.setPassword(userId, newUserAuthData.hash, newUserAuthData.salt);

                res.status(200);
                res.send("Successfully set Password")
            } else {
                res.status(402);
                res.send("Unauthorized. Invalid password!")
            }
        } catch (err) {
            res.status(500);
            res.send("Server Error");
        }
    },

    //Called when the user wants to delete the account
    deleteAccount : function (req, res) {
        var userId = req.session.userId;
        var pass = req.body.pwd;

        if (!userId || !pass) {
            res.status(400);
            res.send("Bad request. Either no session or no password.");
            return;
        }

        try {
            var userAuthData = database.getUserAuthData(userId);

            if (passwordUtil.passwordCorrect(pass, userAuthData.salt, userAuthData.hash)) {
                database.deleteUser(userId);
                res.status(200);
                res.send("Successfully deleted Account");
                req.session.reset();
            } else {
                res.status(401);
                res.send("Unauthorized. Invalid password.")
            }

        } catch (err) {
            console.log(err)
            res.status(500);
            res.send("Server Error");
        }
    },

    //
    updateMail : function (req, res) {
        var userId = req.session.userId;
        var oldMail = req.body.oldMail;
        var newMail = req.body.newMail;
        var pass = req.body.pwd;

        if (!userId || !oldMail || !newMail || !pass) {
            res.status(400);
            res.send("Bad request. Either no session, oldMail, newMail or no password.");
            return;
        }

        if (oldMail == newMail) {
            res.status(400);
            res.send("Bad request. Old mail is new mail.");
            return;
        }

        try {
            if (!userId == database.getUserIdFromMail(oldMail)) {
                res.status(401);
                res.send("Unauthorized! Mail and session do not match!");
                return;
            }

            var userAuthData = database.getUserAuthData(userId);

            if (passwordUtil.passwordCorrect(pass, userAuthData.salt, userAuthData.hash)) {
                changeMail.send(oldMail, newMail);
                res.status(200);
                res.send("Send an validation E-Mail");
                return;
            } else {
                res.status(401);
                res.send("Error updating the email")
            }

        } catch (err) {
            console.log(err)
            res.status(500);
            res.send("Server Error");
        }

    },

    confirmNewMail : function (req, res) {
        var validationKey = req.params.validationKey;

        if (!validationKey) {
            res.status(400);
            res.send("Bad request. No validation key.");
            return;
        }

        try {
            if (database.validationKeyExists(validationKey)) {
                var userId = database.getUserIdFromValidationKey(validationKey);
                var newMail = database.getNewMailFromValidationKey(validationKey);

                database.updateMail(userId, newMail);

                res.status(200);
                res.send("Successfully updated mail address");
            } else {
                res.status(401);
                res.send("Unauthorized. Invalid validation key.");
                return;
            }
        } catch (err) {
            console.log(err)
            res.status(500);
            res.send("Server Error");
        }
    },

    test : function (req, res) {
        tests.startUnitTests(req,res);
    },

    unknownpage : function (req, res) {
      res.status(404);
      res.send('Unknown Endpoint')
    }
};
