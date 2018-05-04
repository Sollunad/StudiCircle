const constant = require('./constants');
const circleConstants = require('../Circle/constants');
const db = require('../Database/database.js');

module.exports = {

    checkStudentMail: async function(mail){
        console.log("CHECK MAIL : " + mail);
        try {
            let domain = mail.split("@");
            if (!domain || !domain[1]){
                throw "error: no mail address";
            }
            return await db.UniMail.findAll({ where:{ 'domain': domain[1] }}).then(mail => {
                if ( mail &&  mail[0] && mail[0].dataValues.domain)
                    return  true;
                throw  "database error";
            }).error(err => {
                throw   "database error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    deleteUser : async function (userId) {
        console.log("DELETE USER - UserId: " + userId);
        try {
            return await db.User.findById( userId ).then( user => {
                if ( user &&  user && user.dataValues.id) {
                    try {
                        return !! db.User.destroy({
                            where: {
                                id: userId
                            }
                        });
                    } catch (e) {
                        return false;
                    }
                } else
                    throw  "database error";
            }).error(err => {
                throw   "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    getNewMailFromValidationKey : async function (validationKey) {
        try {
            return await db.ValidationKey.findAll({ where:{ 'validationKey': validationKey }}).then(validationKey => {
                if ( validationKey &&  validationKey[0] && validationKey[0].dataValues.id)
                    return  validationKey[0].dataValues.newMail;
                throw  "database error";
            }).error(err => {
                throw   "database error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    getUserData : async function(userId) {
        try {
            return await db.User.findById(userId).then(user => {
                if ( user ) {
                    console.log(
                        "id: " + userId,
                        "username: "+ user.dataValues.name+
                        "mail: "+ user.dataValues.email+
                        "type: "+ user.dataValues.type+
                        "state: "+ user.dataValues.state+
                        "businessDescription: "+ user.dataValues.businessDescription+
                        "lastActivity: " + user.dataValues.lastActivity);
                    return {
                        "id": userId,
                        "username": user.dataValues.name,
                        "mail": user.dataValues.email,
                        "type": user.dataValues.type,
                        "state": user.dataValues.state,
                        "businessDescription": user.dataValues.businessDescription,
                        "lastActivity": user.dataValues.lastActivity
                    };
                }
            }).error(err => {
                throw  "database error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }

    },

    getAccountTypeByUserId : async function(userId) {
        try {
            return await db.User.findById(userId).then(user => {
                if ( user ) {
                    return user.dataValues.type;
                }
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
            return await db.ValidationKey.findAll({ where:{ 'validationKey': validationKey }}).then( validationKey => {
                if ( validationKey &&  validationKey[0] && validationKey[0].dataValues.id)
                    return  validationKey[0].dataValues.UserId;
                throw false;
            }).error(err => {
                throw "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error: user doesn't exists";
        }
    },

    getTimestampFromValidationKey : async function (validationKey) {
        try {
            return await db.ValidationKey.findAll({ where:{ 'validationKey': validationKey }}).then( validationKey => {
                if ( validationKey &&  validationKey[0] && validationKey[0].dataValues.id)
                    return  validationKey[0].dataValues.updatedAt;
                throw  "database error";
            }).error(err => {
                throw   "database error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    getCircleInvitationsFromUserId : async function (userId) {
        try {
            return await db.Invitation.findAll({ where:{ 'UserId': userId }}).then(invitations => {
                if (invitations && invitations.length > 0) {
                    var returnArray = [];
                    let length = invitations.length;
                    for (var i=0; i<length; i = i +1) {
                        var singleInvitation = {};
                        singleInvitation.id = invitations[i].dataValues.id;
                        singleInvitation.UserId = invitations[i].dataValues.UserId;
                        singleInvitation.CircleId = invitations[i].dataValues.CircleId;
                        singleInvitation.updatedAt = invitations[i].dataValues.updatedAt;
                        returnArray.push(singleInvitation);
                    }
                    return returnArray;
                }
                throw "UserId without invitations!";
            }).error(err => {
                console.log(error);
                throw "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    addUserToCircle : async function (userId, circleId) {
        try {
           return await db.Circle.findById( circleId ).then(circle => {
               circle.addUser(userId).then(result => {
                   if (result[0]) {
                       result[0][0].update({"role": circleConstants.CircleRole.MEMBER});
                       return true;
                   } else {
                       return false;
                   }
               });
           }).error(err => {
               throw   "error";
           });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    removeInvitation : async function (invitationId) {
        try {
            return await db.Invitation.findById( invitationId ).then( invitation => {
                if ( invitation && invitation.dataValues.id) {
                    try {
                        return !! db.Invitation.destroy({
                            where: {
                                id: invitationId
                            }
                        });
                    } catch (e) {
                        return false;
                    }
                } else
                    throw  "database error";
            }).error(err => {
                throw   "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
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
    },

    getCircleNameById : async function (circleId) {
        try{
            return await db.Circle.findById( circleId ).then( circle => {
                if ( circle &&  circle && circle.dataValues.id)
                    return  circle.dataValues.name;
                throw  "database error";
            }).error(err => {
                throw   "error";
            });
        }catch (error) {
            console.log(err);
            throw false;
        }
    },

    insertNewPerson: async function(mail, username, password, salt, accountType, randomString){
        console.log("insert new person");
        try {
              return db.User.create({
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
        //console.log("INSERT USER - Mail: " + mail + " | Hash: " + password + " | Salt: " + salt + " | Account Type: " + accountType + " | Token: " + randomString);
    },

    setChangeMailKey : async function (oldMail, newMail, validationKey) {
        console.log("SET CHANGE MAIL KEY - Token: " + validationKey + " | OldMail: " + oldMail + " | NewMail: " + newMail);
        try {
            let userId= await this.getUserIdFromMail(oldMail);
            return await db.User.findById( userId ).then( user => {
                if ( user &&  user && user.dataValues.id) {
                    return user.updateAttributes({
                        'state': constant.AccountState.PENDING
                        }).then(() => {
                            return db.ValidationKey.create({
                                validationKey: validationKey,
                                newMail: newMail,
                                UserId: userId
                            }).then(() => {
                                return true;
                            }).error( (err) => {
                                console.log(err);
                                throw  "database error";
                            });
                    }).error(() => {
                        throw false;
                    });
                }
                throw  "database error";
            }).error( (err) => {
                console.log(err);
                throw   "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    setPassword : async function (userId, hash, salt) {
        console.log("SET PASSWORD - userId: " + userId + " | Hash: " + hash + " | Salt: " + salt);
        try {
            return await db.User.findById(userId).then(user => {
                if ( user && user.dataValues.id){
                    return user.updateAttributes({
                        'pwdHash': hash,
                        'salt': salt
                    }).then(() => {
                        return true;
                    }).error(() => {
                        throw false;
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

    setUsername : async function (userId, userName) {
        console.log("SET USERID - userId: " + userId + " | Username: " + userName);
        try {
            return await db.User.findById(userId).then(user => {
                if ( user && user.dataValues.id){
                    return user.updateAttributes({
                        'name': userName
                    }).then(() => {
                        return true;
                    }).error(() => {
                        throw false;
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
    
    setState : async function (validationKey, newState) {
        console.log("SET STATE - Token: " + validationKey + " | New State: " + newState);
        try {
            let userId = await this.getUserIdFromValidationKey(validationKey);
            return await db.User.findById(userId).then(user => {
                console.log("user:" + user + user.dataValues.state);
                if ( user && user.dataValues.id){
                    return user.updateAttributes({
                        'state' : newState
                    }).then(() =>{
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

    setValidationKey : async function (mail, validationKey) {
        console.log("SET VALIDATION KEY - Token: " + validationKey + " | Mail: " + mail);
        try {
            return await db.ValidationKey.findAll({ where:{ 'newMail': mail }}).then(validationKey => {
                if ( validationKey && validationKey[0] && validationKey[0].dataValues.validationKey){
                    return validationKey[0].updateAttributes({
                        'validationKey' : validationKey
                    }).then(() =>{
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

    createValidationKeyByyUserId : async function (userId, validationKey1) {
        console.log("SET VALIDATION KEY - Token: " + validationKey1 + " | UserId: " + userId);
        try {
            return db.ValidationKey.create({
                validationKey: validationKey1,
                UserId: userId
            }).then(validationKey => {
                if ( validationKey && validationKey.validationKey){
                    return true;
                }
                throw false;
            }).error(err => {
                console.log(err);
                throw   "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    updateMail : async function (userId, newMail) {
        console.log("UPDATE MAIL - UserId: " + userId + " | NewMail: " + newMail);
        try {
            return await db.User.findById(userId).then(user => {
                if ( user && user.dataValues.id){
                    return user.updateAttributes({
                        'email' : newMail,
                        'state': constant.AccountState.ACTIVE
                    }).then(() => {
                        return true;
                    }).error(() => {
                        throw "error";
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

    userMailExists : async function (mail) {
        try {
            return await db.User.findAll({ where:{ 'email': mail }}).then(user => {
                if ( user &&  user[0] && user[0].dataValues.id)
                    console.log("exists!!");
                    return  !!user[0].dataValues.email;
                throw  "database error";
            }).error(err => {
                throw   "database error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    userExists : async  function (userId) {
        try {
            return await db.User.findById(userId).then(user => {
                if ( user && user.dataValues.id)
                    return true;
                else
                    return false;
            }).error(err => {
                throw   "error";
            });
        } catch (err) {
            console.log(err);
            throw "database error";
        }
    },

    validationKeyExists : async function (validationKey) {
        try {
            return  !!this.getUserIdFromValidationKey(validationKey); // convert int to bool
        }catch (err) {
            throw "database error at validationKey";
        }
    }
}