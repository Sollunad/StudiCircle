const database = require('./database');
const registration = require('./registration');

module.exports = {

    getUserData : function (userId) {
        var userData;
        try {
            userData = database.getUserData(userId);
        } catch (err) {
            throw "Database Error";
        }
        return userData;
    },

    userExists : function (userId) {
        try {
            return database.userExists(userId);
        } catch (err){
            throw "Database Error";
        }
    },

    sendInvitation : async function (invitingUserId, mail, circle) {
        try {
            if (await database.userMailExists(mail)){
                //normal invitation
                return false;
            }else{ //extern user invitation
                return await registration.externInvitation(mail,invitingUserId, circle);
            }
        } catch (error) {

        }
    },
}