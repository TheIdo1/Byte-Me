// controllers/tokens.controller.js
// Handles the login action — token is prepared by auth middleware and attached to req.token.

// POST /api/tokens
// Body: { username, password }  (already validated by tokenValidator)
// Returns the token payload on success, or 401 on bad credentials.
const createToken = (req, res) => {
    res.status(200).json(req.token);
};

module.exports = { createToken };
