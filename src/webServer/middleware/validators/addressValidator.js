// middleware/validators/addressValidator.js
// Reusable address validation logic.
// Returns an error message string if invalid, or null if the address is valid.

const ALLOWED_ADDRESS_FIELDS = ['city', 'street', 'houseNum', 'floor'];

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
    
    // Type checks
    if (typeof address.city   !== 'string') return 'address.city must be a string.';
    if (typeof address.street !== 'string') return 'address.street must be a string.';
    if (typeof address.houseNum !== 'number' || !Number.isInteger(address.houseNum) || address.houseNum <= 0) {
        return 'address.houseNum must be a positive integer.';
    }
    if (typeof address.floor !== 'number' || !Number.isInteger(address.floor) || address.floor < 0) {
        return 'address.floor must be a non-negative integer (0 = ground floor).';
    }

    return null; // valid
};

module.exports = { validateAddress };
