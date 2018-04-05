const constant = require('./constants');
const crypto = require('crypto');

module.exports = {
    passwordIsCompliant: function (password) {

        if (password.length < constant.PASS_MIN_LENGTH || password.length > constant.PASS_MAX_LENGTH) {
            return false;
        }
        const regex = /^[(\w+\d+äüöÄÖÜ!\"\§\$\%\&\/\(\)\[\]\{\}\=\ß\?\@\+\*\'\;\:\-\<\>\|\#\^\°\~\,\.\_\€\µ)]{8,64}$/;
        let result = regex.test(password);

        return result;
    },

    hashPassword : function (password, salt) {
        var userValue = salt + password;
        var hash = crypto.createHash('sha256').update(userValue, 'utf8').digest('hex');
        return hash;
    },

    passwordCorrect : function (password, salt, hash) {
        return hash == this.hashPassword(password, salt);
    },

    generateUserAuthData : function (password) {
        var returnObject = {};
        var salt = this.generateSalt();
        var hash = this.hashPassword(password, salt);

        returnObject.salt = salt;
        returnObject.hash = hash;

        return returnObject;
    },

    generateSalt : function() {
        return crypto.randomBytes(constant.SALT_LENGTH).toString('base64');
    }

}