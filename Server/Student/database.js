const constant = require('./constants');

module.exports = {
    getUserData : function(userId) {
        return {"userId":userId, "username":"testUser", "mail":"studicircle@googlegroups.com", "role":constant.AccountType.STUDENT, "status":constant.AccountState.ACTIVE};
    },

    getUserIdFromMail : function(mail) {
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
        //duplicateUsername
        //invalidPwd
        //invalidAccountType
        //randomExisting
        return resultMessage;
    },

    setPasswordHash : function (userId, hash) {

    },
    
    setState : function (validationKey, newState) {
        return true;
    },

    setValidationKey : function (mail, validationKey) {
        return true;
    },

    setChangeMailKey : function (oldMail, newMail, validationKey) {
        return true;
    },

    getNewMailFromValidationKey : function (validationKey) {
        return "test@example.com"
    },

    updateMail : function (userId, newMail) {

    },

    validationKeyExists : function (validationKey) {
        return true;
    },

    userExists : function (mail) {
        return true;
    },

    deleteUser : function (userId) {

    }
}