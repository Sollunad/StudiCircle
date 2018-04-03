const constant = require('./constants');
const db = require('../Database/database.js');

module.exports = {
    getUserData : async function(userId) {
        var returnVal = {};
        try {
            returnVal = await db.User.findById(userId).then(user => {
                return    {"id":userId, "username": user.dataValues.name, "mail": user.dataValues.email, "type": user.dataValues.type, "state": user.dataValues.state, "businessDescription": user.dataValues.businessDescription, "lastActivity": user.dataValues.lastActivity};
            }).error(err => {
                return   "error";
                //return  {"userId":userId, "username":"testUser", "mail":"studicircle@googlegroups.com", "role":constant.AccountType.STUDENT, "status":constant.AccountState.ACTIVE};
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
        return returnVal;
    },

    getUserIdFromMail : async function(mail) {
        var returnVal = "";
        try {
            returnVal = await db.User.findAll({ where:{ 'email': mail }}).then(user => {
                if ( user &&  user[0] && user[0].dataValues.id)
                    return  user[0].dataValues.id;
                throw  "database error";
            }).error(err => {
                throw   "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
        return returnVal;
    },

    getUserIdFromValidationKey : function(validationKey) {
        return 1;
    },

    getUserAuthData : function(userId) {
        return {"salt":"s3cureSalt", "hash":"7b51f5fb4d524cd29f5057cc2859244e520b74a20ffe35773ea16b9c253e5229"};
    },

    insertNewPerson: async function(mail, username, password, salt, accountType, randomString){
        console.log("insert new person");

        var returnVal = "";
        try {
              db.User.create({
                name: username,
                email: mail,
                pwdHash: password,
                salt:salt,
                type:accountType,
                state:constant.AccountState.PENDING
            }).then( (user)=> {
                db.ValidationKey.create({
                    validationKey: randomString
                }).then( validationKey => {
                    validationKey.setUser(user);
                    return "ok";
                }).error( err =>{
                    throw  "database error";
                });
            }).error(err => {
                    return "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
        return returnVal;

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