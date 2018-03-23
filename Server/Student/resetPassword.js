const constant = require('./constants');
var database = require('./database');
var mailer = require('./mailer');

module.exports = {
    reset: function (user) {
        var uuid = mailer.generateRandomString(constant.KEY_LENGTH);
        database.setValidationKey(user, uuid);

        //TODO

        return true;
    }
}