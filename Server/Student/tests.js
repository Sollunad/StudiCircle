const constant = require('./constants');
let database = require('./database');
let mailer = require('./mailer');
let registration = require('./registration');
let resetPwd = require('./passwordResetMail');


module.exports = {
    startUnitTests : function (req, res) {
        let response = "Start tests ...\n";

/*        response += this.testActivation();
        response += this.testDatabase();
        response += this.testMailer();
        response += this.testRegistration();
        response += this.testResetPassword();
*/
        response += "End of tests :)"
        res.send(response);
    },

    testActivation : function () {
        let result = false;
        let response = "Start user activation test...\n";

        result = activation.activateNewUser("1234");
        if (result){
            response += "activate user passed\n";
        }else {
            response += "error at activate user --------------------------------------\n";
        }

        result = activation.activateExistingUser("1234","password");
        if (result){
            response += "activate user passed\n";
        }else {
            response += "error at activate user --------------------------------------\n";
        }

        result = activation.setNewPassword("session1234","old", "newpwd");
        if (result){
            response += "activate user passed\n";
        }else {
            response += "error at activate user --------------------------------------\n";
        }

        return response;
    },

    testDatabase : function () {
        let result = false;
        let response = "Start database test...\n";

        result = database.passwordIsCompliant("user","password");
        if (result){
            response += "passwordIsCompliant passed\n";
        }else {
            response += "error at passwordIsCompliant --------------------------------------\n";
        }

        result = database.getUserData("user");
        if (result){
            response += "passwordIsCompliant passed\n";
        }else {
            response += "error at passwordIsCompliant --------------------------------------\n";
        }

        result = database.insertNewPerson("mail", "password", 1, "randomString");
        if (result === "ok"){
            response += "insertNewPerson passed\n";
        }else {
            response += "error at insertNewPerson --------------------------------------\n";
        }

        result = database.newSession("user");
        if (result){
            response += "newSession passed\n";
        }else {
            response += "error at newSession --------------------------------------\n";
        }

        result = database.setNewPassword("user","newpwd");
        if (result){
            response += "setNewPassword passed\n";
        }else {
            response += "error at setNewPassword --------------------------------------\n";
        }

        result = database.setPassword("key","pwd");
        if (result){
            response += "setPassword passed\n";
        }else {
            response += "error at setPassword --------------------------------------\n";
        }

        result = database.setState("key",1);
        if (result){
            response += "setState passed\n";
        }else {
            response += "error at setState --------------------------------------\n";
        }

        result = database.setValidationKey("username","key");
        if (result){
            response += "setValidationKey passed\n";
        }else {
            response += "error at setValidationKey --------------------------------------\n";
        }

        result = database.validateSession("key");
        if (result){
            response += "validateSession passed\n";
        }else {
            response += "error at validateSession --------------------------------------\n";
        }

        return response;
    },

    testMailer : function () {
        let result = false;
        let response = "Start mailer test...\n";

        result = mailer.sendMail("mailaddress","html","subject");
        if (result){
            response += "sendMail passed\n";
        }else {
            response += "error at sendMail --------------------------------------\n";
        }

        result = mailer.checkMailAddress("mailaddress");
        if (result){
            response += "checkMailAddress passed\n";
        }else {
            response += "error at checkMailAddress --------------------------------------\n";
        }

        result = mailer.generateRandomString(constant.KEY_LENGTH);
        if (result){
            response += "generateRandomString passed\n";
        }else {
            response += "error at generateRandomString --------------------------------------\n";
        }

        return response;
    },

    testRegistration : function () {
        let result = false;
        let response = "Start user registration test...\n";

        result = registration.register("mailaddress", "pwd", 1, null);
        if (result){
            response += "register passed\n";
        }else {
            response += "error at register --------------------------------------\n";
        }

        return response;
    },

    testResetPassword : function () {
        let result = false;
        let response = "Start reset password test...\n";

        result = resetPwd.reset("username")
        if (result){
            response += "reset passed\n";
        }else {
            response += "error at reset --------------------------------------\n";
        }

        return response;
    }

}