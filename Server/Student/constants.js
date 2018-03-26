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
const API_URL_ROOT_DEV = "https://api.dev.sknx.de";

const UI_URL_ROOT_PRODUCTIVE = "https://studicircle.sknx.de";
const UI_URL_ROOT_DEV = "https://studicircle.dev.sknx.de";

module.exports = {

    AccountState: AccountState,
    AccountType: AccountType,
    KEY_LENGTH: KEY_LENGTH,
    SALT_LENGTH : SALT_LENGTH,

    getActivationURL : function (activationToken) {
        var root;
        if (!process.env.StudicircleTest) {
            root = API_URL_ROOT_PRODUCTIVE;
        } else {
            root = API_URL_ROOT_DEV;
        }
        return root + "/user/" + activationToken + "/" + "activate";
    },

    getPasswordChangeURL : function (activationToken) {
        var root;
        if (!process.env.StudicircleTest) {
            root = UI_URL_ROOT_PRODUCTIVE;
        } else {
            root = UI_URL_ROOT_DEV;
        }
        return root + "/forgotPassword/" + activationToken;
    },

    getNewMailActivationURL : function (activationToken) {
        var root;
        if (!process.env.StudicircleTest) {
            root = API_URL_ROOT_PRODUCTIVE;
        } else {
            root = API_URL_ROOT_DEV;
        }
        return root + "/user/" + activationToken + "/" + "changeMail";
    }
}