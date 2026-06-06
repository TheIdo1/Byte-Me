const tokensModel = require('../models/tokens.model');
const jwt = require('jsonwebtoken'); // Import the JWT library

const createToken = (req, res) => {
    const { username, password } = req.body;

    // Authenticate the user against the mock database
    // userData is an obj of {id: "userId"}
    const userData = tokensModel.createToken(username, password);
    if (!userData) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Generate a JWT containing the user's ID. the format is jwt.sign(payload, secret, options)
    // process.env.JWT_SECRET is used to cryptographically sign the token
    // expiresIn: '2h' ensures the token becomes invalid after 2 hours for security
    const token = jwt.sign(
        { id: userData.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' }
    );

    // Return the JWT to the client
    res.status(200).json({ token: token });
};

module.exports = { createToken };
