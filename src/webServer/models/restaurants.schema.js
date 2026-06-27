// src/webServer/models/restaurants.schema.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    city: { type: String, required: true },
    street: { type: String, required: true },
    houseNum: { type: Number, required: true },
    floor: { type: Number, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
}, { _id: false });

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },

    // Array of User MongoDB ObjectId strings (users authorised to manage this restaurant)
    authorizedUsers: [{ type: String }],

    phone: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, default: '' },
    subcategories: [{ type: String }],
    address: { type: addressSchema, required: true },

    // Array of Product MongoDB ObjectId strings
    products: [{ type: String }],

    rating: { type: Number, default: 1 },
    isSponsored: { type: Boolean, default: false },
    promotionalMessage: { type: String, default: 'Try Us' }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
