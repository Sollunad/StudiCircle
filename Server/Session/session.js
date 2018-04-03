let crypto = require('crypto');
const constant = require('./constants');
let HashMap = require('hashmap');

var sessionsObj = new HashMap();

module.exports = {
    generateSession : function (userID) {
        let sessionID = crypto.randomBytes(constant.SESSION_ID_LENGTH).toString('base64');
        var singleSession = {};
        singleSession.userID = userID;
        singleSession.start = new Date();
        singleSession.update = new Date();
        sessionsObj.set(sessionID, singleSession);
        //console.log("Sessions Object: %j", sessionsObj);
        return sessionID;
    },

    getUserID : function (sessionID) {
        return sessionsObj.get(sessionID);
    }
};
