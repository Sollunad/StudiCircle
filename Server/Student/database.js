const constant = require('./constants');
const db = require('../Database/database.js');

module.exports = {

    deleteUser : function (userId) {
        console.log("DELETE USER - UserId: " + userId);
    },

    getNewMailFromValidationKey : function (validationKey) {
        return "test@example.com"
    },

    getUserData : async function(userId) {
        try {
            await db.User.findById(userId).then(user => {
                return    {"id":userId, "username": user.dataValues.name, "mail": user.dataValues.email, "type": user.dataValues.type, "state": user.dataValues.state, "businessDescription": user.dataValues.businessDescription, "lastActivity": user.dataValues.lastActivity};
            }).error(err => {
                throw  "database error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    getUserIdFromMail : async function(mail) {
        try {
            return await db.User.findAll({ where:{ 'email': mail }}).then(user => {
                if ( user &&  user[0] && user[0].dataValues.id)
                    return  user[0].dataValues.id;
                throw  "database error";
            }).error(err => {
                throw   "database error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    getUserIdFromValidationKey : async function( validationKey ) {
        try {
            return await db.ValidationKey.findById( validationKey ).then( validationKey => {
                if ( validationKey &&  validationKey && validationKey.dataValues.id)
                    return  validationKey.dataValues.id;
                throw false;
            }).error(err => {
                throw "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
        return 1;
    },

    getUserAuthData : async function( userId ) {
        try {
            return await db.User.findById( userId ).then( user => {
                if ( user &&  user && user.dataValues.id)
                    return  {"salt": user.dataValues.salt, "hash": user.dataValues.pwdHash};
                throw  "database error";
            }).error(err => {
                throw   "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
        // return {"salt":"99/m2P3YFRV8OPZa2zUWUoBeAU150mIQ5iIjgY8cas0FdlMeghnyprtuOQiQZJu1", "hash":"fb7a30b7ff7272572a6f8b555c76acf63b700f8d50109403085fa8e4adfc7728"};
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

    setChangeMailKey : function (oldMail, newMail, validationKey) {
        console.log("SET CHANGE MAIL KEY - Token: " + validationKey + " | OldMail: " + oldMail + " | NewMail: " + newMail);
        return true;
    },

    setPassword : function (userId, hash, salt) {
        console.log("SET PASSWORD - userId: " + userId + " | Hash: " + hash + " | Salt: " + salt);
    },
    
    setState : async function (validationKey, newState) {
        console.log("SET STATE - Token: " + validationKey + " | New State: " + newState);
        try {
            let userId = await getUserIdFromValidationKey(validationKey);
            await db.User.findById(userId).then(user => {
                if ( user && user.dataValues.id){
                    user.dataValues.state = newState;
                    user.save().then(() =>{
                        return true;
                    });
                }else{
                    throw  false;
                }
            }).error(err => {
                throw   "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    setValidationKey : function (mail, validationKey) {
        console.log("SET VALIDATION KEY - Token: " + validationKey + " | Mail: " + mail);
        return true;
    },

    updateMail : async function (userId, newMail) {
        console.log("UPDATE MAIL - UserId: " + userId + " | NewMail: " + newMail);

    },

    userMailExists : async function (mail) {
        try {
            return await db.User.findAll({ where:{ 'email': mail }}).then(user => {
                if ( user &&  user[0] && user[0].dataValues.id)
                    return  !!user[0].dataValues.mail;
                throw  "database error";
            }).error(err => {
                throw   "database error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    userExists : function (userId) {
        return true;
    },

    validationKeyExists : async function (validationKey) {
        try {
            return  !!this.getUserIdFromValidationKey(validationKey); // convert int to bool
        }catch (err) {
            throw "database error";
        }
    }
}