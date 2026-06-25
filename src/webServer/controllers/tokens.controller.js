// src/webServer/controllers/tokens.controller.js
const usersService = require('../services/users.service');
const jwt = require('jsonwebtoken'); // Import the JWT library

const createToken = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Authenticate the user against MongoDB through the user service.
        // userData is a public user object that contains the user's id.
        const userData = await usersService.getUserByCredentials(username, password);

        if (!userData) {
            return res.status(401).json({
                error: 'Invalid username or password.'
            });
        }

        // Generate a JWT containing the user's ID. The format is:
        // jwt.sign(payload, secret, options)
        // process.env.JWT_SECRET is used to cryptographically sign the token.
        // expiresIn: '2h' ensures the token becomes invalid after 2 hours.
        const token = jwt.sign(
            { id: userData.id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Return the JWT to the client.
        return res.status(200).json({ token });

    } catch (error) {
        // This can happen if MongoDB is unavailable or another database error occurs.
        return res.status(500).json({
            error: 'Failed to authenticate user.'
        });
    }
};

module.exports = { createToken };