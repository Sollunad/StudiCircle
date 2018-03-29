const database = require('./database');

module.exports = {

    getUserData : function (userId) {
        var userData;
        try {
            userData = database.getUserData(userId);
        } catch (err) {
            throw "Database Error";
        }
        return userData;
    },

    userExists : function (userId) {
        try {
            database.userExists(userId);
        } catch (err){
            throw "Database Error";
        }
    },
}