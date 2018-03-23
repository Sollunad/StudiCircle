var registration = require('./registration');
var activation = require('./setPassword');
var database = require('./database');
var resetPwd = require('./passwordResetMail');
var tests = require('./tests');

module.exports = {

    activate : function (req, res) {
        let result = false;
        result = activation.activateNewUser(req.params.uuid);
        if (result){
            res.send("Successfully validated new user account.");
        }else{
            res.send("Error at validating UUID "+req.params.uuid +'!');
        }
    },

    resetPassword : function (req, res) {
        if (activation.activateExistingUser(req.params.uuid, req.body.password)) {
            res.send("Success");
        } else {
            res.send("Error");
        }
    },

    setNewPassword : function (req, res) {
        var session = req.body.session;
        var oldPw = req.body.oldPw;
        var newPw = req.body.newPw;

        if (activation.setNewPassword(session, oldPw, newPw)) {
            res.send('Success');
        } else {
            res.status(400);
            res.send('Failed');
        }
    },

    forgotPassword: function (req, res) {
        if (database.validateSession(req.body.session)) {
            var user = req.body.user;
            if (resetPwd.reset(user)) {
                res.send("Success");
            } else {
                res.send("Error");
            }
        } else {
            res.status(401);
            res.send('Unauthorized');
        }
    },

    helloworld : function (req, res) {
        res.send('Hello World!');
    },

    register : function (req, res) {
        var mailAddress = req.body.mail;
        var password = req.body.pwd;
        var accountType = req.body.type;

        //console.log(mailAddress + "\n" + password + "\n" + accountType + "\n" + res);

        registration.register(mailAddress, password, accountType, res);
    },

    login : function (req, res) {
        var user = req.body.user;
        var pass = req.body.pass;

        if (database.checkPassword(user, pass)) {
            res.send(database.newSession());
        } else {
            res.status(401);
            res.send('Unauthorized!')
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