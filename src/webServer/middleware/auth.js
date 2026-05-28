// auth.js
// Central authentication module — owns all token-related responsibility.
// The controller calls auth.login(); this file decides what a "token" looks like.
// In the next exercise this is where JWT signing will be added.

const usersModel = require('../models/users.model');

/*
Verifies the given credentials and, if valid, returns a token payload.
For now the "token" is simply the user's id.
Returns { id } on success, or null if credentials are wrong.
*/
const login = (req, res, next) => {
    const { username, password } = req.body;

    const user = usersModel.getUserByCredentials(username, password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // TODO: replace with a signed JWT in the next exercise
    req.token = { id: user.id };
    next();
};

module.exports = { login };
