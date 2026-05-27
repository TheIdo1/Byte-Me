const ALLOWED_UPDATE_FIELDS = ['customerId', 'restaurantId', 'orderedItems'];
const ALLOWED_CREATE_FIELDS = ['customerId', 'restaurantId', 'orderedItems'];

const validateOrderUpdate = (req, res, next) => {
    const body = req.body;
    const updates = Object.keys(body);

    // Check if empty body meaning nothing to update
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update.' });
    }

    // Check if there areforbidden or unknown field
    // Filter out any key that is not in ALLOWED_UPDATE_FIELDS.
    // This automatically blocks id, date, and any typos or unknown fields.
    const invalidFields = updates.filter(f => !ALLOWED_UPDATE_FIELDS.includes(f));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: `Invalid fields: ${invalidFields.join(', ')}. ` +
                   `Allowed fields are: ${ALLOWED_UPDATE_FIELDS.join(', ')}.`
        });
    }

    // Check type validation
    // Each check is guarded by !== undefined so that optional fields that
    // were not sent by the client are simply skipped.
    const { customerId, restaurantId, orderedItems } = body;

    // customerId must be a string (we use UUID which is a string format)
    if (customerId !== undefined && typeof customerId !== 'string') {
        return res.status(400).json({ error: 'customerId must be a string.' });
    }

    // restaurantId must be a string (same UUID format)
    if (restaurantId !== undefined && typeof restaurantId !== 'string') {
        return res.status(400).json({ error: 'restaurantId must be a string.' });
    }

    // orderedItems has three sub-checks:
    if (orderedItems !== undefined) {

        // must be an array, not an object or string
        if (!Array.isArray(orderedItems)) {
            return res.status(400).json({ error: 'orderedItems must be an array.' });
        }

        // must not be empty an order with no items makes no sense
        if (orderedItems.length === 0) {
            return res.status(400).json({ error: 'orderedItems cannot be empty.' });
        }

        // every element must be a string (a product UUID)
        if (!orderedItems.every(item => typeof item === 'string')) {
            return res.status(400).json({ error: 'Every item in orderedItems must be a string (product id).' });
        }
    }

    // all checks passed
    // next() tells Express to move to the next function in the chain,
    // which is the updateOrder controller.
    next();
};

const validateCreateOrder = (req, res, next) => {
    const body = req.body;
    
    // check the there arent forbidden/unknown fields
    const invalidFields = Object.keys(body).filter(f => !ALLOWED_CREATE_FIELDS.includes(f));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: `Invalid fields: ${invalidFields.join(', ')}. ` +
                   `Allowed fields are: ${ALLOWED_CREATE_FIELDS.join(', ')}.`
        });
    }

    // check if required fields must be present
    if (!body.customerId) {
        return res.status(400).json({ error: 'customerId is required.' });
    }
    if (!body.restaurantId) {
        return res.status(400).json({ error: 'restaurantId is required.' });
    }
    if (!body.orderedItems) {
        return res.status(400).json({ error: 'orderedItems is required.' });
    }

    // type validation
    if (typeof body.customerId !== 'string') {
        return res.status(400).json({ error: 'customerId must be a string.' });
    }
    if (typeof body.restaurantId !== 'string') {
        return res.status(400).json({ error: 'restaurantId must be a string.' });
    }
    if (!Array.isArray(body.orderedItems)) {
        return res.status(400).json({ error: 'orderedItems must be an array.' });
    }
    if (body.orderedItems.length === 0) {
        return res.status(400).json({ error: 'orderedItems cannot be empty.' });
    }
    if (!body.orderedItems.every(item => typeof item === 'string')) {
        return res.status(400).json({ error: 'Every item in orderedItems must be a string (product id).' });
    }

    // all checks passed
    // next() tells Express to move to the next function in the chain,
    // which is the createOrder controller.
    next();
};

module.exports = { validateCreateOrder, validateOrderUpdate };
