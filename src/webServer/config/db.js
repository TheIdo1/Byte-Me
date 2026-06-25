// src/webServer/config/db.js
const mongoose = require('mongoose');

/*
  Connects to the MongoDB database using Mongoose.
  This function utilizes the MONGO_URI from the environment variables.
  It includes a try-catch block to handle initial connection failures.
*/
const connectDB = async () => {
    try {
        // Attempt to establish a connection to the database
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit the Node.js process with a failure code (1) if the connection fails.
        // Since we are running inside Docker, the 'restart: unless-stopped' policy
        // in docker-compose.yml will automatically try to restart the container.
        process.exit(1);
    }
};

module.exports = connectDB;