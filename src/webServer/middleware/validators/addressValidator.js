// middleware/validators/addressValidator.js
// Reusable address validation logic.
// validateAddress(address) – pure utility, returns an error string or null.
// validateAddressMiddleware    – Express middleware, reads req.body.address.

const ALLOWED_ADDRESS_FIELDS = ['city', 'street', 'houseNum', 'floor', 'lat', 'long'];

const validateAddress = (address) => {
    if (typeof address !== 'object' || Array.isArray(address)) {
        return 'address must be an object.';
    }

    // Block unknown fields
    const invalidFields = Object.keys(address).filter(f => !ALLOWED_ADDRESS_FIELDS.includes(f));
    if (invalidFields.length > 0) {
        return `Invalid address fields: ${invalidFields.join(', ')}. ` +
               `Allowed fields are: ${ALLOWED_ADDRESS_FIELDS.join(', ')}.`;
    }

    // Required fields
    if (!address.city) {
        return 'address.city is required.';
    }
    if (!address.street) {
        return 'address.street is required.';
    }
    if (address.houseNum === undefined) {
        return 'address.houseNum is required.';
    }
    if (address.floor    === undefined) {
        return 'address.floor is required.';
    }
    if (address.lat    === undefined) {
        return 'address.lat is required.';
    }
    if (address.long    === undefined) {
        return 'address.long is required.';
    }

    // Type checks
    if (typeof address.city   !== 'string') return 'address.city must be a string.';
    if (typeof address.street !== 'string') return 'address.street must be a string.';
    if (typeof address.houseNum !== 'number' || !Number.isInteger(address.houseNum) || address.houseNum <= 0) {
        return 'address.houseNum must be a positive integer.';
    }
    if (typeof address.floor !== 'number' || !Number.isInteger(address.floor) || address.floor < 0) {
        return 'address.floor must be a non-negative integer (0 = ground floor).';
    }

    // cordinates
    const numberFields = ['long', 'lat'];
    for (const field of numberFields) {
        if (body[field] !== undefined && typeof body[field] !== 'number') {
            return res.status(400).json({ error: `${field} must be a number.` });
        }
    }

    return null; // valid
};

// Express middleware wrapper — assumes a prior middleware already confirmed
// that req.body.address exists.
const validateAddressMiddleware = (req, res, next) => {
    const error = validateAddress(req.body.address);
    if (error) return res.status(400).json({ error });
    next();
};

// if address field does not exist, pass the test.
// if exist, must be up to standart
const validateAddressOptional = (req, res, next) => {
    if (req.body.address === undefined)
        return next();
    const error = validateAddress(req.body.address);
    if (error) return res.status(400).json({ error });
    next();
};

module.exports = { validateAddress, validateAddressMiddleware, validateAddressOptional };
