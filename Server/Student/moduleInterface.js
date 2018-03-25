const database = require('./database');

module.exports = {

    // You are responsible for errors that might occure when calling this function!
    getUserDataFromSession : function (session) {
        var sessionExists;
        try {
            sessionExists = database.sessionExists(session);
        } catch (err) {
            throw "Database Error";
        }
        if (!sessionExists) {
            throw "Invalid Session";
        }
        var userData;
        try {
            var userId = database.getUserIdFromSession(session);
            userData = database.getUserData(userId);
        } catch (err) {
            throw "Database Error";
        }
        return userData;
    },

    getUserId : function (session) {
        var sessionExists;
        try {
            sessionExists = database.sessionExists(session);
        } catch (err) {
            throw "Database Error";
        }
        if (!sessionExists) {
            throw "Invalid Session";
        }
        var userId;
        try {
            var userId = database.getUserIdFromSession(session);
        } catch (err) {
            throw "Database Error";
        }
        return userId;
    },

    getUserDataFromUserId : function (userId) {
        var userData;
        try {
            userData = database.getUserData(userId);
        } catch (err) {
            throw "Database Error";
        }
        return userData;
    },

    isSessionValid : function (session) {
        var sessionExists;
        try {
            sessionExists = database.sessionExists(session);
        } catch (err) {
            throw "Database Error";
        }
        return sessionExists;
    }
}