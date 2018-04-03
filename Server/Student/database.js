const constant = require('./constants');
const db = require('../Database/database.js');

module.exports = {
    getUserData : async function(userId) {
        var returnVal = {};
        console.log(returnVal);
        try {
            returnVal = await db.User.findById(userId).then(user => {
                console.log(user.dataValues);
                console.log("!");
                console.log(user.dataValues.id);
                return    {"userId":userId, "username": user.dataValues.name, "mail":"studicircle@googlegroups.com", "role":constant.AccountType.STUDENT, "status":constant.AccountState.ACTIVE};
            }).error(err => {
                return   {"userId":userId, "username":"testUser", "mail":"studicircle@googlegroups.com", "role":constant.AccountType.STUDENT, "status":constant.AccountState.ACTIVE};
                //return  {"userId":userId, "username":"testUser", "mail":"studicircle@googlegroups.com", "role":constant.AccountType.STUDENT, "status":constant.AccountState.ACTIVE};
            });
        } catch (err) {
            console.log(err);
        }
        console.log("return:");
        console.log(returnVal);
        return returnVal;
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
        console.log("INSERT USER - Mail: " + mail + " | Hash: " + password + " | Salt: " + salt + " | Account Type: " + accountType + " | Token: " + randomString);
        return resultMessage;
    },

    setPassword : function (userId, hash, salt) {
        console.log("SET PASSWORD - userId: " + userId + " | Hash: " + hash + " | Salt: " + salt);
    },
    
    setState : function (validationKey, newState) {
        console.log("SET STATE - Token: " + validationKey + " | New State: " + newState);
        return true;
    },

    setValidationKey : function (mail, validationKey) {
        console.log("SET VALIDATION KEY - Token: " + validationKey + " | Mail: " + mail);
        return true;
    },

    setChangeMailKey : function (oldMail, newMail, validationKey) {
        console.log("SET CHANGE MAIL KEY - Token: " + validationKey + " | OldMail: " + oldMail + " | NewMail: " + newMail);
        return true;
    },

    getNewMailFromValidationKey : function (validationKey) {
        return "test@example.com"
    },

    updateMail : function (userId, newMail) {
        console.log("UPDATE MAIL - UserId: " + userId + " | NewMail: " + newMail);
    },

    validationKeyExists : function (validationKey) {
        return true;
    },

    userMailExists : function (mail) {
        return true;
    },

    userExists : function (userId) {
        return true;
    },

    deleteUser : function (userId) {
        console.log("DELETE USER - UserId: " + userId);
    }
}