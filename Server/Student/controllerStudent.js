const crypto = require('crypto');
const constants = require('./constants');
const database = require('./database');
const registration = require('./registration');
const resetPwd = require('./passwordResetMail');
const tests = require('./tests');

module.exports = {

    activate : function (req, res) {
        var validationKey = req.params.validationKey;

        if (typeof validationKey == 'undefined') {
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

    resetPassword : function (req, res) {
        var validationKey = req.params.validationKey;
        var newPassword = req.body.pwd;

        if (typeof validationKey == 'undefined' || typeof newPassword == 'undefined') {
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
                res.send("Password successfully reset.")
            } else {
                res.status(401);
                res.send("Invalid validation key!");
            }
        } catch (err) {
            res.status(500);
            res.send("Server Error");
        }
    },

    setPassword : function (req, res) {
        var session = req.body.session;
        var oldPw = req.body.oldPwd;
        var newPw = req.body.newPwd;

        if (typeof session == 'undefined' || typeof oldPw == 'undefined' || typeof newPw == 'undefined') {
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

    forgotPassword: function (req, res) {
        var mail = req.body.mail;

        if (typeof mail == 'undefined' ) {
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

    register : function (req, res) {
        var mailAddress = req.body.mail;
        var password = req.body.pwd;
        var accountType = req.body.type;

        //console.log(mailAddress + "\n" + password + "\n" + accountType + "\n" + res);

        registration.register(mailAddress, password, accountType, res);
    },

    login : function (req, res) {
        var mail = req.body.mail;
        var pass = req.body.pwd;

        if (typeof mail == 'undefined' || typeof pass == 'undefined') {
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

    test : function (req, res) {
        tests.startUnitTests(req,res);
    },

    helloworld : function (req, res) {
        res.send('Hello World!');
    },

    unknownpage : function (req, res) {
      res.status(404);
      res.send('Unknown Endpoint')
    }
};