// middleware/validators/tokenValidator.js
// Validates the body of POST /api/tokens before it reaches the controller.

const ALLOWED_FIELDS = ['username', 'password'];

const validateCreateToken = (req, res, next) => {
    const body = req.body;

    // Reject unknown / forbidden fields
    const invalidFields = Object.keys(body).filter(f => !ALLOWED_FIELDS.includes(f));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: `Invalid fields: ${invalidFields.join(', ')}. ` +
                   `Allowed fields are: ${ALLOWED_FIELDS.join(', ')}.`
        });
    }

    // Both fields are required
    if (!body.username) return res.status(400).json({ error: 'username is required.' });
    if (!body.password) return res.status(400).json({ error: 'password is required.' });

    // Type validation — both must be strings
    if (typeof body.username !== 'string') return res.status(400).json({ error: 'username must be a string.' });
    if (typeof body.password !== 'string') return res.status(400).json({ error: 'password must be a string.' });

    // All checks passed — hand off to the controller
    next();
};

module.exports = { validateCreateToken };
