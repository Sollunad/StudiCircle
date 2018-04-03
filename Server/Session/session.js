let crypto = require('crypto');
const constant = require('constants');
let HashMap = require('hashmap');

var sessionsObj = new HashMap();

module.exports = {
    session: sessionsObj,

    generateSession : function (userID) {
        let sessionID = crypto.randomBytes(constant.SESSION_KEY_LEN).toString('base64');
        sessionsObj.set(sessionID, userID);
        return sessionID;
    },

    getUserID : function (sessionID) {
        return sessionObj.get(sessionID);
    }
};