const constant = require('./constants');
var database = require('./database');


module.exports = {
    activateNewUser: function (uuid) {
        let result =false;
        result = database.setState(uuid, constant.AccountState.ACTIVE);
        return result;
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