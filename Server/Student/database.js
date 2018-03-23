const constant = require('./constants');

module.exports = {
    insertNewPerson: function(mail, password, accountType, randomString){
        console.log("insert new person");
        let resultMessage = "ok";
        //duplicateMail
        //invalidPwd
        //invalidAccountType
        //randomExisting
        return resultMessage;
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