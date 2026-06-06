const usersModel = require('../models/users.model');
const jwt = require('jsonwebtoken'); // Import the JWT library


// Middleware to protect routes that require authentication.
// It extracts the JWT from the 'Authorization' header, verifies its signature,
// and attaches the decoded user ID to the request object.
const requireAuth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Authorization token required.' });
    }

    try {
        // Verify the token using our secret key. 
        // If the signature is invalid or the token is expired, this will throw an error.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user ID to the request so subsequent controllers can use it
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

/*
Resolves the logged-in user from the Authorization header.
Sets req.userId to the user's UUID if the token is valid, or null if absent/unknown.
Non-blocking — used for routes where auth is optional but enables C++ updates.
*/
const optionalAuth = (req, _res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        req.userId = null;
        return next();
    }
    
    try {
        // Attempt to verify the token silently
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
    } catch (err) {
        // If the token is invalid/expired, we just ignore it and proceed as a guest
        req.userId = null;
    }
    
    next();
};

module.exports = { requireAuth, optionalAuth };
