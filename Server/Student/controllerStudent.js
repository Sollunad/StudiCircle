var registration = require('./registration');
var activation = require('./setPassword');
var resetPwd = require('./passwordResetMail');

module.exports = {

    activate : function (req, res) {
        activation.activateNewUser(req.params.uuid);
        res.send("Validating UUID "+req.params.uuid +'!');
    },

    resetPassword : function (req, res) {
        if (activation.activateExistingUser(req.params.uuid, req.body.password)) {
            res.send("Success");
        } else {
            res.send("Error");
        }
    },

    setNewPassword : function (req, res) {
        var user = req.body.user;
        var pw = req.body.pw;

        activation.setNewPassword(user, pw);
        res.send("Success")
    },

    forgotPassword: function (req, res) {
        var user = req.body.user;
        if (resetPwd.reset(user)) {
            res.send("Success");
        } else {
            res.send("Error");
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

    test : function (req, res) {
        let response = "Start unit tests\n";

    },

    unknownpage : function (req, res) {
      res.status(404);
      res.send('Unknown Endpoint')
    }
};