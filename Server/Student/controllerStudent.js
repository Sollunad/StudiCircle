const crypto = require('crypto');
const constants = require('./constants');
const database = require('./database');
const registration = require('./registration');
const resetPwd = require('./passwordResetMail');
const changeMail = require('./changeMailMail');
const tests = require('./tests');

module.exports = {

    //Called when a user wants to create an account
    //Will send a validation Mail
    register : function (req, res) {
        var mailAddress = req.body.mail;
        var password = req.body.pwd;
        var accountType = req.body.type;

        res.send(mailAddress + "\n pwd: " + password + "\n: type" + accountType + "\n");
        //console.log(mailAddress + "\n" + password + "\n" + accountType + "\n" + res);

        //registration.register(mailAddress, password, accountType, res);
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

    //Called when the user sets a new password
    setPassword : function (req, res) {
        var session = req.body.session;
        var oldPw = req.body.oldPwd;
        var newPw = req.body.newPwd;

        if (!session || !oldPw || !newPw) {
            res.status(400);
            res.send("Bad request. No session, old or new password.");
            return;
        }

        try {
            if (!database.sessionExists(session)) {
                res.status(401);
                res.send("Unauthorized. Invalid session!")
                return;
            }

            var userId = database.getUserIdFromSession(session);
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
        var session = req.body.session;
        var pass = req.body.pwd;

        if (!session || !pass) {
            res.status(400);
            res.send("Bad request. Either no session or no password.");
            return;
        }

        try {
            if (!database.sessionExists(session)) {
                res.status(401);
                res.send("Invalid Session!")
                return;
            }
            var userId = database.getUserIdFromSession(session);
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
        var session = req.body.session;
        var oldMail = req.body.oldMail;
        var newMail = req.body.newMail;
        var pass = req.body.pwd;

        if (!session || !oldMail || !newMail || !pass) {
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
            if (!database.sessionExists(session)) {
                res.status(401);
                res.send("Invalid Session!");
                return;
            }
            var userId = database.getUserIdFromSession(session);

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
                res.send("Unauthorized. No invalid validation key.");
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
