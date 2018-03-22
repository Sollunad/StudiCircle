var database = require('./database');
const constant = require('./constants');


module.exports = {
    activateNewUser: function (uuid) {
        database.setState(uuid,constant.AccountState.ACTIVE);
    }
}