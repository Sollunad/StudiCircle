const constant = require('./constants');

module.exports = {
    getUserData : function(username) {
        return {"username":username, "mail":"studicircle@googlegroups.com"};
    },

    getUserIdFromMail : function(mail) {
        return 1;
    },

    getUserIdFromSession : function(session) {
        return 1;
    },

    getUserIdFromValidationKey : function(validationKey) {
        return 1;
    },

    getUserAuthData : function(userId) {
        return {"salt":"s3cureSalt", "hash":"7b51f5fb4d524cd29f5057cc2859244e520b74a20ffe35773ea16b9c253e5229"};
    },

    insertNewPerson: function(mail, password, salt, accountType, randomString){
        console.log("insert new person");
        let resultMessage = "ok";
        //duplicateMail
        //invalidPwd
        //invalidAccountType
        //randomExisting
        return resultMessage;
    },

    newSession : function (userId) {
        return {"sessionId":"lorem"};
    },

    sessionExists : function (session) {
        return true;
    },

    setPasswordHash : function (userId, hash) {

    },
    
    setState : function (validationKey, newState) {
        return true;
    },

    setValidationKey : function (username, validationKey) {
        return true;
    },

    validationKeyExists : function (validationKey) {
        return true;
    },
}