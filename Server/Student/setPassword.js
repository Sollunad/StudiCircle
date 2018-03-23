const constant = require('./constants');
var database = require('./database');


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

    setNewPassword : function (session, oldPassword, newPassword) {
        var user = database.validateSession(session);
        if (database.checkPassword(user, oldPassword)) {
            database.setNewPassword(user, newPassword);
            return true;
        } else {
            return false;
        }
    }
}