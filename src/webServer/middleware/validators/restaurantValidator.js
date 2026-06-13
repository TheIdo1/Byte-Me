const ALLOWED_CREATE_FIELDS = ['name', 'description', 'category', 'authorizedUsers', 'phone', 'email', 'address', 'products', 'rating', 'isSponsored', 'promotionalMessage', 'subcategories', 'image'];
const REQUIRED_CREATE_FIELDS = ['name', 'category', 'authorizedUsers', 'phone', 'email', 'address', 'subcategories', 'image'];
const ALLOWED_UPDATE_FIELDS = ['name', 'description', 'category', 'authorizedUsers', 'phone', 'email', 'address', 'products', 'rating', 'isSponsored', 'promotionalMessage', 'subcategories', 'image'];

const validateRestaurantUpdate = (req, res, next) => {
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
    const stringFields = ['name', 'description', 'category', 'phone', 'email', 'promotionalMessage', 'image'];
    for (const field of stringFields) {
        if (body[field] !== undefined && typeof body[field] !== 'string') {
            return res.status(400).json({ error: `${field} must be a string.` });
        }
    }

    // Array validations
    const arrayFields = ['authorizedUsers', 'products', 'subcategories'];
    for (const field of arrayFields) {
        if (body[field] !== undefined) {
            if (!Array.isArray(body[field])) {
                return res.status(400).json({ error: `${field} must be an array.` });
            }
            //authorized user must have at least one field
            if (field === 'authorizedUsers' && body['authorizedUsers'].length < 1){
                return res.status(400).json({error: `authorizedUsers must contain at least one user id`})
            }
            
            // Check if array contains only strings 
            if (!body[field].every(item => typeof item === 'string')) {
                return res.status(400).json({ error: `Every item in ${field} must be a string.` });
            }
        }
    }


    // Number validations
    const numberFields = ['rating'];
    for (const field of numberFields) {
        if (body[field] !== undefined && typeof body[field] !== 'number') {
            return res.status(400).json({ error: `${field} must be a number.` });
        }
    }

    // Boolean validations
    const booleanFields = ['isSponsored'];
    for (const field of booleanFields) {
        if (body[field] !== undefined && typeof body[field] !== 'boolean') {
            return res.status(400).json({ error: `${field} must be a boolean (true or false).` });
        }
    }

    // Object validation (address)
    if (body.address !== undefined) {
        // In JavaScript, arrays and null are technically objects, so we explicitly exclude them
        if (typeof body.address !== 'object' || Array.isArray(body.address) || body.address === null) {
            return res.status(400).json({ error: 'address must be a valid JSON object.' });
        }
    }

    // all checks passed
    next();
};


const validateCreateRestaurant = (req, res, next) => {
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
    // (Since we already confirmed required fields exist, we don't need 'undefined' checks for them,
    // but the loop structure handles optional fields nicely too).

    // 1. String validations
    const stringFields = ['name', 'description', 'category', 'phone', 'email', 'promotionalMessage'];
    for (const field of stringFields) {
        if (body[field] !== undefined && typeof body[field] !== 'string') {
            return res.status(400).json({ error: `${field} must be a string.` });
        }
    }

    // 2. Array validations
    const arrayFields = ['authorizedUsers', 'products'];
    for (const field of arrayFields) {
        if (body[field] !== undefined) {
            if (!Array.isArray(body[field])) {
                return res.status(400).json({ error: `${field} must be an array.` });
            }
            //authorized user must have at least one field
            if (field === 'authorizedUsers' && body['authorizedUsers'].length < 1){
                return res.status(400).json({error: `authorizedUsers must contain at least one user id`})
            }
            if (!body[field].every(item => typeof item === 'string')) {
                return res.status(400).json({ error: `Every item in ${field} must be a string.` });
            }
        }
    }

    // 3. Object validation (address)
    if (typeof body.address !== 'object' || Array.isArray(body.address) || body.address === null) {
        return res.status(400).json({ error: 'address must be a valid JSON object.' });
    }

    // Number validations
    const numberFields = ['rating'];
    for (const field of numberFields) {
        if (body[field] !== undefined && typeof body[field] !== 'number') {
            return res.status(400).json({ error: `${field} must be a number.` });
        }
    }

    // Boolean validations
    const booleanFields = ['isSponsored'];
    for (const field of booleanFields) {
        if (body[field] !== undefined && typeof body[field] !== 'boolean') {
            return res.status(400).json({ error: `${field} must be a boolean (true or false).` });
        }
    }

    // all checks passed
    next();
};


module.exports = { validateCreateRestaurant, validateRestaurantUpdate };
