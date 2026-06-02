const usersModel = require('./users.model');

const createToken = (username, password) => {
    const user = usersModel.getUserByCredentials(username, password);
    if (!user) return null;
    return { id: user.id };
};

module.exports = { createToken };
