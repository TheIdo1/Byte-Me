const usersModel = require('../models/users.model');

const requireAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token required.' });
    }
    const user = usersModel.getUserById(token);
    if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    req.userId = token;
    next();
};

/*
Resolves the logged-in user from the Authorization header.
Sets req.userId to the user's UUID if the token is valid, or null if absent/unknown.
Non-blocking — used for routes where auth is optional but enables C++ updates.
*/
const optionalAuth = (req, _res, next) => {
    const token = req.headers['authorization'];
    req.userId = (token && usersModel.getUserById(token)) ? token : null;
    next();
};

module.exports = { requireAuth, optionalAuth };
