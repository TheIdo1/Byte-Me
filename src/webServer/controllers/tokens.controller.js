// controllers/tokens.controller.js
// Handles the login action — delegates all token logic to auth.js.

const auth = require('../auth');

// POST /api/tokens
// Body: { username, password }  (already validated by tokenValidator)
// Returns the token payload on success, or 401 on bad credentials.
const createToken = (req, res) => {
    const { username, password } = req.body;

    const token = auth.login(username, password);

    if (!token) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    res.status(200).json(token);
};

module.exports = { createToken };
