var registration = require('./registration');
var activation = require('./activateUser');

module.exports = {

    helloworld : function (req, res) {
        res.send('Hello World!');
    },

    unknownpage : function (req, res) {
      res.status(404);
      res.send('Unknown Endpoint')
    },

    register : function (req, res) {
        console.log("test1");
        var mailAddress = req.body.mail;
        var password = req.body.pwd;
        var accountType = req.body.type;

        console.log(mailAddress + "\n" + password + "\n" + accountType + "\n" + res);

        registration.register(mailAddress, password, accountType, res);
    },

    changePassword : function (req, res) {
        res.send('Hello Test!');
    },

    activate : function (req, res) {
        activation.activateNewUser(req.params.uuid);
        res.send("Validating UUID "+req.params.uuid +'!');
    }



};