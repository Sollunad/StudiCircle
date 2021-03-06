const circle = require('../Circle/controllerCircle');
const changeMail = require('./changeMailMail');
const constants = require('./constants');
const database = require('./database');
const mailer = require('./mailer');
const passwordResetForm = require('./passwordResetForm');
const passwordUtil = require('./passwordCheck');
const registerGuestForm = require('./registerForm');
const registration = require('./registration');
const resetPwd = require('./passwordResetMail');
const mySession = require('../Session/session');
const tests = require('./tests');
const responder = require('./responseSender');


module.exports = {

    //Called when a user wants to create an account
    //Will send a validation Mail
    register : function (req, res) {
        let mailAddress = req.body.mail;
        let password = req.body.pwd;
        let accountType = req.body.type;
        let userName = req.body.username;
        let businessDescription =req.body.businessDescription.split(" :\n")[1];
        let businessName = req.body.businessDescription.split(" :\n")[0];
        registration.register(mailAddress, password, accountType, userName, res, businessDescription, businessName);
    },

    //Called when user clicks the link in the validation Mail.
    activate : async function (req, res) {
        var validationKey = req.params.validationKey;

        if (!validationKey) {
            responder.sendResponse(res, 400, "Bad request. No uuid.");
            return;
        }
        try {
            if ( await database.validationKeyExists(validationKey)) {
                //console.log("validation key exists");
                if (await database.setState(validationKey, constants.AccountState.ACTIVE)){
                    let userId = await database.getUserIdFromValidationKey(validationKey);
                    let type = await  database.getAccountTypeByUserId(userId);
                    if ( type == constants.AccountType.BUSINESS) {
                        await registration.registrationInform(validationKey, "Your account registration is activated successfully.");
                    }
                    responder.sendResponse(res, 201, "Successfully validated new user account.");
                }
            } else {
                responder.sendResponse(res, 401, "Unauthorized. Invalid validation key.");
            }
        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 500);
        }
    },

    //Called when user clicks the link in the validation Mail.
    disableInvitation : async function (req, res) {
        var validationKey = req.params.validationKey;

        if (!validationKey) {
            responder.sendResponse(res, 400, "Bad request. No uuid.");
            return;
        }
        try {
            if ( await database.validationKeyExists(validationKey)) {
                console.log("validation key exists");
                if (await database.setState(validationKey, constants.AccountState.DISABLED)){
                    await registration.registrationInform( validationKey, "Your account registration is rejected.");
                    responder.sendResponse(res, 201, "Successfully disabled new user account invitation.");
                }
            } else {
                responder.sendResponse(res, 401, "Unauthorized. Invalid validation key.");
            }
        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 500);
        }
    },

    informAboutRegistration : async function (validationKey, message){
        let userId = await database.getNewMailFromValidationKey(validationKey);
        let userData = await database.getUserData(userId);
        let html = '<html lang="de-DE">\n' +
            '<head>\n' +
            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
            '</head>\n' +
            '<body>\n' +
            '<h1>Validation of your new business account "' + userData.username + '"</h1>'+
            '<p>' + message + '</p> '+
            '</body>\n' +
            '</html>';
        let subject = 'StudiCircle: Validation of your new business account';
        await mailer.sendMail(userData.mail, html, subject);
    },

    //Called when user requests a Mail to reset her/his password
    forgotPassword: async function (req, res) {
        var mail = req.body.mail;

        if (!mail) {
            responder.sendResponse(res, 400, "Bad request. No mail.");
            return;
        }

        try {
            if (await database.userMailExists(mail)) {
                await resetPwd.reset(mail);
            }
            responder.sendResponse(res, 200, "Reset mail sent if user is known.");
        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 500);
        }
    },

    passwordResetPage : function (req, res) {
        let validationKey = req.params.validationKey;
        if (!validationKey) {
            responder.sendResponse(res, 400, "Bad request. No validation key.");
        } else {
            res.status(200);
            res.send(passwordResetForm.getForm(validationKey));
        }
    },

    //Called when user sends a new Password after requesting a password reset mail using the client
    resetPassword : async function (req, res) {
        let validationKey = req.body.validationKey;
        let newPassword = req.body.pwd;

        if (!validationKey || !newPassword) {
            responder.sendResponse(res, 400, "Bad request. No validation key or password.");
            return;
        }

        try {
            if (await database.validationKeyExists(validationKey)) {
                try {
                    var userId = await database.getUserIdFromValidationKey(validationKey);

                    var userAuthData = passwordUtil.generateUserAuthData(newPassword);
                    var hash = userAuthData.hash;
                    var salt = userAuthData.salt;

                    await database.setPassword(userId, hash, salt);

                    responder.sendResponse(res, 200, "Password successfully reset.");
                } catch (err) {
                    console.log(err);
                    responder.sendResponse(res, 500);
                }
            } else {
                responder.sendResponse(res, 401, "Invalid validation key!");
            }
        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 500);
        }
    },

    //Called when the user wants to login to studiCircle. Will send session an d user data if credentials are valid
    login : async function (req, res) {
        let mail = req.body.mail;
        let pass = req.body.pwd;

        if (!mail || !pass) {
            responder.sendResponse(res, 400, "Bad request. Either no username or no password.");
            return;
        }
        let userId = 0;
        try {
            userId = await database.getUserIdFromMail(mail);
        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 451, "Mail doesn't exists");
            return;
        }
        try {
            console.log("User ID" + userId);

            let userData = await database.getUserData(userId);

            if (userData.state == 'ACTIVE') {

                let userAuthData = await database.getUserAuthData(userId);

                if (passwordUtil.passwordCorrect(pass, userAuthData.salt, userAuthData.hash)) {
                    var returnObject = {};
                    returnObject.httpStatus = 200;
                    returnObject.message = "Successfully Logged in";
                    returnObject.userData = (await database.getUserData(userId));
                    returnObject.session = mySession.generateSession(userId);

                    res.status(200);
                    res.send(returnObject);
                } else {
                    responder.sendResponse( res, 401, "Unauthorized! Wrong Password");
                }
            } else {
                responder.sendResponse(res, 412, "Profile not activated!");
            }
        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 500);
        }
    },

    logout : function (req, res) {
        mySession.invalidate(req.session.sessionId);

        responder.sendResponse(res, 200,"Logout successfull.");
    },

    //Called when the user sets a new password
    setPassword : async function (req, res) {

        var userId = req.session.userId
        var oldPw = req.body.oldPwd;
        var newPw = req.body.newPwd;

        if (!userId || !oldPw || !newPw || !passwordUtil.passwordIsCompliant(newPw)) {
            responder.sendResponse(res, 400, "Bad request. No session, old or new password not set or not compliant to guidelines.");
            return;
        }

        try {
            var userAuthData = await database.getUserAuthData(userId);
            console.log(userAuthData);

            if (passwordUtil.passwordCorrect(oldPw, userAuthData.salt, userAuthData.hash)) {
                var newUserAuthData = passwordUtil.generateUserAuthData(newPw);
                await database.setPassword(userId, newUserAuthData.hash, newUserAuthData.salt);

                res.status(200);
                res.send(true);
//                responder.sendResponse(res, 200, "Successfully set Password");
            } else {
                responder.sendResponse(res, 401, "Unauthorized. Invalid password!");
            }
        } catch (err) {
            responder.sendResponse(res, 500);
        }
    },

    //Called when the user wants to delete the account
    deleteAccount : async function (req, res) {
        var userId = req.session.userId;
        var pass = req.body.pwd;

        if (!userId || !pass) {
            responder.sendResponse(res, 400, "Bad request. Either no session or no password.");
            return;
        }

        try {
            var userAuthData = await database.getUserAuthData(userId);

            if (passwordUtil.passwordCorrect(pass, userAuthData.salt, userAuthData.hash)) {

                 circle.isAdminAnywhere(userId, async function(userIsAdmin) {

                     if (!userIsAdmin) {
                         await database.deleteUser(userId);
                         responder.sendResponse(res, 200, "Successfully deleted Account");
                         req.session.reset();
                     } else {
                         responder.sendResponse(res, 412, "User still Admin in one or more circles");
                     }
                 });

            } else {
                responder.sendResponse(res, 401, "Unauthorized. Invalid password.");
            }

        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 500);
        }
    },

    //
    updateMail : async function (req, res) {
        console.log("update Mail");
        var userId = req.session.userId;
        var oldMail = req.body.oldMail;
        var newMail = req.body.newMail;
        var pass = req.body.pwd;

        console.log("update Mail");
        if (!userId || !oldMail || !newMail || !pass) {
            responder.sendResponse(res, 400, "Bad request. Either no session, oldMail, newMail or no password.");
            return;
        }

        if (oldMail == newMail) {
            responder.sendResponse(res, 400, "Bad request. Old mail is new mail.");
            return;
        }

        try {
            if (!userId == (await database.getUserIdFromMail(oldMail))) {
                responder.sendResponse(res, 401, "Unauthorized! Mail and session do not match!");
                return;
            }

            var userAuthData = await database.getUserAuthData(userId);

            if (passwordUtil.passwordCorrect(pass, userAuthData.salt, userAuthData.hash)) {
                changeMail.send(oldMail, newMail);
                responder.sendResponse(res, 200, "Send an validation E-Mail");
            } else {
                responder.sendResponse(res, 401, "Error updating the email");
            }

        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 500);
        }

    },

    confirmNewMail : async function (req, res) {
        var validationKey = req.params.validationKey;

        if (!validationKey) {
            responder.sendResponse(res, 400, "Bad request. No validation key.");
            return;
        }

        try {
            if (await database.validationKeyExists(validationKey)) {
                var userId = await database.getUserIdFromValidationKey(validationKey);
                var newMail = await database.getNewMailFromValidationKey(validationKey);

                await database.updateMail(userId, newMail);

                responder.sendResponse(res, 200, "Successfully updated mail address");
            } else {
                responder.sendResponse(res, 401, "Unauthorized. Invalid validation key.");
            }
        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 500);
        }
    },

    registerGuest : function (req, res) {
        let invitationKey = req.params.validationKey;
        console.log(invitationKey)
        if (!invitationKey) {
            responder.sendResponse(res, 400, "Bad request. No invitation key.");
        } else {
            res.status(200);
            res.send(registerGuestForm.getForm(invitationKey));
        }
    },

    activateGuest : async function (req, res) {
        let invitationKey = req.body.invitationKey;
        let userName = req.body.userName;
        let password = req.body.pwd;

        if (!invitationKey || !password || !userName || !passwordUtil.passwordIsCompliant(password)) {
            responder.sendResponse(res, 400, "Bad request. No invitation key, userId, password or password not comliant to guidelibnes.");
            return;
        }

        try {
            if ( await database.validationKeyExists(invitationKey) ) {
                var userId = await database.getUserIdFromValidationKey(invitationKey);
                console.log("validation key exists");
                await database.setState(invitationKey, constants.AccountState.ACTIVE);
                var newUserAuthData = passwordUtil.generateUserAuthData(password);
                await database.setPassword(userId, newUserAuthData.hash, newUserAuthData.salt);
                await database.setUsername(userId, userName);

                let invitations = await database.getCircleInvitationsFromUserId(userId);
                console.log(invitations);
                if (invitations.length = 1) {
                    let circleId = invitations[0].CircleId;
                    await database.addUserToCircle(userId, circleId);
                    await database.removeInvitation(invitations[0].id);
                } else {
                    let timestamp = database.getTimestampFromValidationKey(invitationKey);
                    let diffs = [];
                    for (var i=0; i < invitations.length; i = i+1) {
                        diffs[i] = Math.abs(invitations.updatedAt - timestamp);
                    }
                    let min = Math.min.apply(null, diffs);
                    let index = diffs.findIndex(singleDiff => singleDiff === min);
                    let circleId = invitations[index].CircleId;
                    await database.addUserToCircle(userId, circleId);
                    await database.removeInvitation(invitations[0].id);
                }
                responder.sendResponse(res, 200, "Successfully registerd new User");
            } else {
                responder.sendResponse(res, 401, "Unauthorized. Invalid validation key.");
            }
        } catch (err) {
            console.log(err);
            responder.sendResponse(res, 500);
        }
    },

    trigger : async function (req, res) {
        console.log('Trigger');

        try {
            console.log("start");
            let result = await database.setPassword(13, "hash", "salt");
            console.log(result);
        } catch (err) {
            console.log("error at set password: " + err);
        }
        responder.sendResponse(res, 200, "OK");
    },

    test : function (req, res) {
        tests.startUnitTests(req,res);
    },

    unknownpage : function (req, res) {
        responder.sendResponse(res, 404, "Unknown Endpoint");
    }
};
