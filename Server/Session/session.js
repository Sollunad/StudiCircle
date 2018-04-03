let crypto = require('crypto');
const constant = require('../Student/constants');
let HashMap = require('hashmap');

var sessionsObj = new HashMap();

module.exports = {
    session: sessionsObj,

    generateSession : function (userID) {
        let sessionID = crypto.randomBytes(constant.SALT_LENGTH).toString('base64');
        sessionsObj.set(sessionID, userID);
        return sessionID;
    },

    getUserID : function (sessionID) {
        return sessionObj.get(sessionID);
    }
};
