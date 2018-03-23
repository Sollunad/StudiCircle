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

module.exports = {

    AccountState: AccountState,
    AccountType: AccountType,
    KEY_LENGTH: KEY_LENGTH
}