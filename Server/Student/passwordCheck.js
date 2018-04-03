const constant = require('./constants');
module.exports = {
    checkPassword: function (password) {

        if (password.length < constant.PASS_MIN_LENGTH || password.length > constant.PASS_MAX_LENGTH) {
            return false;
        }
        const regex = /^[(\w+\d+äüöÄÖÜ!\"\§\$\%\&\/\(\)\[\]\{\}\=\ß\?\@\+\*\'\;\:\-\<\>\|\#\^\°\~\,\.\_\€\µ)]{8,64}$/;
        let result = regex.test(password);

        return result;
    }
}