let crypto = require('crypto');
const constant = require('./constants');
let HashMap = require('hashmap');

var sessionsObj = new HashMap();

module.exports = {
    sessionsObj: sessionsObj,

    generateSession : function (userID) {
        let sessionID = crypto.randomBytes(constant.SESSION_ID_LENGTH).toString('base64');
        var singleSession = {};
        singleSession.userID = userID;
        singleSession.start = new Date();
        singleSession.lastUpdated = new Date();
        sessionsObj.set(sessionID, singleSession);
        console.log("Sessions Object: %j", sessionsObj);
        return sessionID;
    },

    getSessionData : function (sessionID) {
        var currentSession = sessionsObj.get(sessionID);
        currentSession.lastUpdated = new Date();
        sessionsObj.set(sessionID, currentSession);
        console.log(currentSession);
        return currentSession;
    },

    invalidate : function (sessionID)  {
        console.log("Invalidating Session " + sessionID);
        sessionsObj.delete(sessionID);
    },

    cleanSessions : function () {
        console.log('Cleaning sessions...');
        console.log('Looking for Timedout Sessions');
        var sessionsToDelete = [];
        sessionsObj.forEach(function(value, key) {
            if ((new Date() - value.lastUpdated) > constant.SESSION_RESET_TIME) {
                sessionsToDelete.push(key);
            }
        });
        console.log('Deleting Timedout Sessions');
        sessionsToDelete.forEach(function(value) {
            console.log("Invalidating Session " + value);
            sessionsObj.delete(value);
            console.log('Loop2');
        });
    },
};
