// middleware/validators/userValidator.js
// Validates incoming request data for user endpoints.
// Address structure is validated by validateAddressMiddleware in the route chain.

const usersModel = require('../../models/users.model');

const ALLOWED_CREATE_FIELDS = ['username', 'password', 'firstName', 'lastName', 'email', 'address'];

const validateCreateUser = (req, res, next) => {
    const body = req.body;

    const invalidFields = Object.keys(body).filter(f => !ALLOWED_CREATE_FIELDS.includes(f));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: `Invalid fields: ${invalidFields.join(', ')}. ` +
                   `Allowed fields are: ${ALLOWED_CREATE_FIELDS.join(', ')}.`
        });
    }

    // Required field presence
    if (!body.username)  return res.status(400).json({ error: 'username is required.' });
    if (!body.password)  return res.status(400).json({ error: 'password is required.' });
    if (!body.firstName) return res.status(400).json({ error: 'firstName is required.' });
    if (!body.lastName)  return res.status(400).json({ error: 'lastName is required.' });
    if (!body.email)     return res.status(400).json({ error: 'email is required.' });
    if (!body.address)   return res.status(400).json({ error: 'address is required.' });

    // Type validation
    if (typeof body.username  !== 'string') return res.status(400).json({ error: 'username must be a string.' });
    if (typeof body.password  !== 'string') return res.status(400).json({ error: 'password must be a string.' });
    if (typeof body.firstName !== 'string') return res.status(400).json({ error: 'firstName must be a string.' });
    if (typeof body.lastName  !== 'string') return res.status(400).json({ error: 'lastName must be a string.' });
    if (typeof body.email     !== 'string') return res.status(400).json({ error: 'email must be a string.' });

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
        return res.status(400).json({ error: 'email must be a valid email address.' });
    }

    // All checks passed — address structure is validated next in the chain
    next();
};

/*
Resolves the ?id query param to a C++ integer user ID.
Sets req.userId to the cppId if the user exists, or 0 if not provided/unknown.
Used for routes where logged-in users trigger C++ updates.
*/
const isUserExists = (req, _res, next) => {
    const token = req.query.id;
    req.userId = token ? (usersModel.getUserCppId(token) ?? 0) : 0;
    next();
};

module.exports = { validateCreateUser, isUserExists };
