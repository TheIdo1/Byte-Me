// src/webServer/models/products.schema.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // cppId is maintained for backward compatibility with the C++ TCP server.
    // Auto-generated in the service layer using the Counter schema.
    cppId: {
        type: Number,
        unique: true
    },

    // restaurantId references the restaurant this product belongs to.
    // Stored as a String since restaurants are not yet migrated to MongoDB.
    restaurantId: { type: String, required: true },

    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    image: { type: String, default: '' },
    extras: { type: [String], default: [] },
    isExtra: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false }

}, {
    timestamps: true,

    /**
     * VIRTUALS (CRITICAL FOR BACKWARD COMPATIBILITY):
     * MongoDB uses '_id', but our React frontend expects 'id'.
     * These settings ensure that when Mongoose converts the document to JSON
     * (to send to the frontend), it includes a virtual 'id' field that
     * exactly mirrors the MongoDB '_id' field.
     */
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Product', productSchema);
