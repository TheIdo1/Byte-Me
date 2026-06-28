// src/webServer/models/orders.schema.js
const mongoose = require('mongoose');

/*
  Date Sub-Schema
  Defines the structure for an order's date exactly as the frontend expects it.
  We set { _id: false } because this is an embedded document.
*/
const dateSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    hour: { type: Number, required: true },
    minute: { type: Number, required: true },
    second: { type: Number, required: true }
}, { _id: false });

// Order Schema - Defines the structure for the Order collection in MongoDB.
const orderSchema = new mongoose.Schema({
    date: { type: dateSchema, required: true },
    
    // Using String to maintain compatibility with either UUIDs or MongoDB ObjectIds
    customerId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    
    // Array of product IDs (Strings)
    orderedItems: [{ type: String, required: true }]

}, { 
    // Automatically manages 'createdAt' and 'updatedAt' timestamps
    timestamps: true, 
    
    // VIRTUALS: Ensure MongoDB '_id' maps to 'id' for the React frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Order', orderSchema);