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

    },
    
    setState : function (validationKey, newState) {
        
    },

    setValidationKey : function (username, validationKey) {

    }
}