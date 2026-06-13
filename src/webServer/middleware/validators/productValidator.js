const ALLOWED_CREATE_FIELDS = ['name', 'description', 'category', 'price', 'image', 'extras', 'isExtra'];
const REQUIRED_CREATE_FIELDS = ['name', 'category', 'price', 'isExtra'];
const ALLOWED_UPDATE_FIELDS = ['name', 'description', 'category', 'price', 'image', 'extras', 'isExtra'];

const validateProductUpdate = (req, res, next) => {
    const body = req.body;
    const updates = Object.keys(body);

    // Check if empty body meaning nothing to update
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update.' });
    }

    // Check if there are forbidden or unknown fields
    const invalidFields = updates.filter(f => !ALLOWED_UPDATE_FIELDS.includes(f));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: `Invalid fields: ${invalidFields.join(', ')}. ` +
                `Allowed fields are: ${ALLOWED_UPDATE_FIELDS.join(', ')}.`
        });
    }


    // --- Type Validation ---

    // String validations
    const stringFields = ['name', 'description', 'category', 'image'];
    for (const field of stringFields) {
        if (body[field] !== undefined && typeof body[field] !== 'string') {
            return res.status(400).json({ error: `${field} must be a string.` });
        }
    }

    // Array validations
    const arrayFields = ['extras'];
    for (const field of arrayFields) {
        if (body[field] !== undefined) {
            if (!Array.isArray(body[field])) {
                return res.status(400).json({ error: `${field} must be an array.` });
            }
            // Check if array contains only strings 
            if (!body[field].every(item => typeof item === 'string')) {
                return res.status(400).json({ error: `Every item in ${field} must be a string.` });
            }
        }
    }



    // price validataion
    if (body.price !== undefined) {
        // 1. Must be a number type
        // 2. Must be a finite number (rejects NaN and Infinity)
        // 3. Must be greater than or equal to 0
        if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
            return res.status(400).json({ error: 'price must be a valid, positive number.' });
        }
    }

    // boolean validation
    const booleanFields = ['isExtra'];
    for (const field of booleanFields) {
        if (body[field] !== undefined && typeof body[field] !== 'boolean') {
            return res.status(400).json({ error: `${field} must be a boolean (true or false).` });
        }
    }

    // all checks passed
    next();
};


const validateCreateProduct = (req, res, next) => {
    const body = req.body;

    // Check if there are forbidden/unknown fields
    const invalidFields = Object.keys(body).filter(f => !ALLOWED_CREATE_FIELDS.includes(f));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: `Invalid fields: ${invalidFields.join(', ')}. ` +
                `Allowed fields are: ${ALLOWED_CREATE_FIELDS.join(', ')}.`
        });
    }

    // Check if all required fields are present
    const missingFields = REQUIRED_CREATE_FIELDS.filter(field => body[field] === undefined);
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `Missing required fields: ${missingFields.join(', ')}.`
        });
    }

    // --- Type Validation ---

    // 1. String validations (Updated for products)
    const stringFields = ['name', 'description', 'category', 'image'];
    for (const field of stringFields) {
        if (body[field] !== undefined && typeof body[field] !== 'string') {
            return res.status(400).json({ error: `${field} must be a string.` });
        }
    }

    // 2. Array validations (Updated for 'extras')
    const arrayFields = ['extras'];
    for (const field of arrayFields) {
        if (body[field] !== undefined) {
            if (!Array.isArray(body[field])) {
                return res.status(400).json({ error: `${field} must be an array.` });
            }
            if (!body[field].every(item => typeof item === 'string')) {
                return res.status(400).json({ error: `Every item in ${field} must be a string.` });
            }
        }
    }

    // 3. Price validation (Copied over from your update method)
    if (body.price !== undefined) {
        if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
            return res.status(400).json({ error: 'price must be a valid, positive number.' });
        }
    }

    // All checks passed
    next();
};


module.exports = { validateCreateProduct, validateProductUpdate };
