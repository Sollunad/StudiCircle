const AccountType = {
    BUSINESS: 1,
    GUEST: 2,
    STUDENT: 3
};

const AccountState = {
    ACTIVE: 1,
    PENDING: 2,
    DISABLED: 3
};

const KEY_LENGTH = 48;
const SALT_LENGTH = 48;

const API_URL_ROOT_PRODUCTIVE = "https://api.sknx.de";
const API_URL_ROOT_DEV = "https://dev.sknx.de";

const PASS_MIN_LENGTH = 8;
const PASS_MAX_LENGTH = 64;

const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 50;

module.exports = {

    AccountState: AccountState,
    AccountType: AccountType,
    KEY_LENGTH: KEY_LENGTH,
    SALT_LENGTH : SALT_LENGTH,
    PASS_MAX_LENGTH: PASS_MAX_LENGTH,
    PASS_MIN_LENGTH: PASS_MIN_LENGTH,
    USERNAME_MIN_LENGTH: USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH: USERNAME_MAX_LENGTH,

    getActivationURL : function (activationToken) {
        var root = this.getRootURL();
        return root + "/user/activate/" + activationToken;
    },

    getDeactivationURL : function (activationToken) {
        var root = this.getRootURL();
        return root + "/user/disable/" + activationToken;
    },

    getPasswordChangeURL : function () {
        var root = this.getRootURL();
        return root + "/user/resetPassword";
    },

    getNewMailActivationURL : function (activationToken) {
        var root = this.getRootURL();
        return root + "/user/changeMail/" + activationToken;
    },

    getCreateGuestUserURL : function (invitationToken) {
        var root = this.getRootURL();
        return root + "/user/guest/register/" + invitationToken;
    },

    getGuestUserActivationURL : function () {
        var root = this.getRootURL();
        return root + "/user/guest/activate";
    },

    getRootURL : function () {
        var root;
        if (!process.env.StudicircleTest) {
            root = API_URL_ROOT_PRODUCTIVE;
        } else {
            root = API_URL_ROOT_DEV;
        }
        return root;
    }
}