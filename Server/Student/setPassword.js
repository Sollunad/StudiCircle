const constant = require('./constants');
var database = require('./database');
var mailer = require('./mailer');


module.exports = {
    activateNewUser: function (uuid) {
        database.setState(uuid, constant.AccountState.ACTIVE);
        return true;
    },

    activateExistingUser: function (uuid, password) {
        database.setPassword(uuid, password);
        database.setState(uuid, constant.AccountState.ACTIVE);
        return true;
    },

    setNewPassword : function (user, password) {
        database.setNewPassword(user, password);
    }
}