// src/webServer/models/Counter.schema.js
const mongoose = require('mongoose');

/*
  Counter Schema
  This schema acts as an auto-increment sequence generator.
  Since MongoDB does not have a native auto-increment feature, we use this 
  collection to safely generate sequential integers (like the 'cppId' required 
  by our C++ backend) without race conditions.
*/
const counterSchema = new mongoose.Schema({
    // The '_id' will be the name of the sequence (e.g., 'user_cpp_id')
    _id: { 
        type: String, 
        required: true 
    }, 
    // The current sequence number
    seq: { 
        type: Number, 
        default: 0 
    }      
});

module.exports = mongoose.model('Counter', counterSchema);