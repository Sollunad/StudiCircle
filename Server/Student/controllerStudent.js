const crypto = require('crypto');
const constants = require('./constants');
const database = require('./database');
const registration = require('./registration');
const resetPwd = require('./passwordResetMail');
const changeMail = require('./changeMailMail');
const pwdCheck = require('./passwordCheck');
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
            if (database.userExists(mail)) {
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
            var html = "<html>\n" +
                            "<head>\n" +
                                "<title>Reset your Password at Studicircle</title>\n" +
                            "</head>\n" +
                            "<body>\n" +
                                "<h1>Reset your password at StudiCircle</h1>\n" +
                                "<p>\n" +
                                    "To reset your password please fill in the form below:" +
                                "</p>\n"+
                                "<form method='POST' action='" + constants.getPasswordChangeURL(validationKey) + "'>" +
                                    "<label for='pw1'>Password:</label>\n" +
                                    "<input type='password' name='newPassword' id='pw1'/><br>\n" +
                                    "<label for='pw2'>Repeat Password:</label>\n" +
                                    "<input type='password' name='repeatNewPassword' id='pw2'/><br>\n" +
                                    "<input type='submit' value='submit'/>\n" +
                                "</form>\n" +
                            "</body>\n" +
                        "</html>\n";

            res.status(200);
            res.send(html);
        }
    },

    //Called when user sends a new Password after requesting a password reset mail using the client
    resetPassword : function (req, res) {
        var validationKey = req.params.validationKey;
        var newPassword = req.body.pwd;

        if (!validationKey || !newPassword) {
            res.status(400);
            res.send("Bad request. No validation key or password.");
            return;
        }

        try {
            if (database.validationKeyExists(validationKey)) {
                var userId = database.getUserIdFromValidationKey(validationKey);
                var userAuthData = database.getUserAuthData(userId);

                var userValue = userAuthData.salt + newPassword;
                var hash = crypto.createHash('sha256').update(userValue, 'utf8').digest('hex');

                database.setPasswordHash(userId, hash);

                res.status(200);
                res.send("Password successfully reset.");
            } else {
                res.status(401);
                res.send("Invalid validation key!");
            }
        } catch (err) {
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
            var userId = database.getUserIdFromMail(mail);
            var userAuthData = database.getUserAuthData(userId);

            var userValue = userAuthData.salt + pass;
            var hash = crypto.createHash('sha256').update(userValue, 'utf8').digest('hex');

            if (hash == userAuthData.hash) {
                var returnObject = {};
                returnObject.status = 200;
                returnObject.message = "Successfully Logged in";
                returnObject.session = database.newSession(userId);
                returnObject.userData = database.getUserData(userId);

                req.session.userId = userId;

                res.status(200);
                res.send(returnObject);
            } else {
                res.status(401);
                res.send('Unauthorized!');
            }
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

        if (!userId || !oldPw || !newPw || !pwdCheck.checkPassword(newPw)) {
            res.status(400);
            res.send("Bad request. No session, old or new password not set or not compliant to guidelines.");
            return;
        }

        try {
            var userAuthData = database.getUserAuthData(userId);

            var userValue = userAuthData.salt + oldPw;
            var hash = crypto.createHash('sha256').update(userValue, 'utf8').digest('hex');

            if (hash == userAuthData.hash) {
                var newHash = userAuthData.salt + newPw;
                database.setPasswordHash(userId, newHash);

                res.status(200);
                res.send("Successfully set Password")
            } else {
                res.status(401);
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

            var userValue = userAuthData.salt + pass;
            var hash = crypto.createHash('sha256').update(userValue, 'utf8').digest('hex');

            if (hash == userAuthData.hash) {
                database.deleteUser(userId);
                res.status(200);
                res.send("Successfully deleted Account")
                return;
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

            var userValue = userAuthData.salt + pass;
            var hash = crypto.createHash('sha256').update(userValue, 'utf8').digest('hex');

            if (hash == userAuthData.hash) {
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
            if (!database.validationKeyExists(validationKey)) {
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
