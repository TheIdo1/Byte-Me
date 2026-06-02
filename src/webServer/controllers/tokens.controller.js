const tokensModel = require('../models/tokens.model');

const createToken = (req, res) => {
    const { username, password } = req.body;
    const token = tokensModel.createToken(username, password);
    if (!token) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
    res.status(200).json(token);
};

module.exports = { createToken };
