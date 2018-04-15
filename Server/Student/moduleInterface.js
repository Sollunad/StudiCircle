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
            return await registration.externInvitation(mail,invitingUserId, circle);
        } catch (error) {
            console.log(error);
        }
    },
}