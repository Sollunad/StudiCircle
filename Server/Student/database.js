const constant = require('./constants');

module.exports = {
    getUserData : function(username) {
        return {"username":username, "mail":"studicircle@googlegroups.com"};
    },

    insertNewPerson: function(mail, password, accountType, randomString){
        console.log("insert new person");
        let resultMessage = "ok";
        //duplicateMail
        //invalidPwd
        //invalidAccountType
        //randomExisting
        return resultMessage;
    },

    setNewPassword : function(user, newPass) {
        return true;
    },

    setPassword : function (validationKey, password) {
        return true;
    },
    
    setState : function (validationKey, newState) {
        return true;
    },

    setValidationKey : function (username, validationKey) {
        return true;
    }
}