// src/webServer/models/User.schema.js
const mongoose = require('mongoose');

/*
  Address Sub-Schema
  Defines the structure for a user's address.
  We set { _id: false } because this is an embedded document and doesn't 
  need its own unique MongoDB ObjectId.
*/
const addressSchema = new mongoose.Schema({
    city: { type: String, required: true },
    street: { type: String, required: true },
    houseNum: { type: Number, required: true },
    floor: { type: Number, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
}, { _id: false });


// User Schema - Defines the structure for the User collection in MongoDB.
const userSchema = new mongoose.Schema({
    // cppId is maintained for backward compatibility with the C++ TCP server.
    // It will be auto-generated in the service layer using the Counter schema.
    cppId: { 
        type: Number, 
        unique: true 
    }, 
    
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
    // Optional fields
    phone: { type: String, default: null }, 
    isRestaurantOwner: { type: Boolean, default: false },
    
    // Embedded address sub-document
    address: addressSchema

}, { 
    // Automatically manages 'createdAt' and 'updatedAt' timestamps
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

module.exports = mongoose.model('User', userSchema);