// src/webServer/services/users.service.js
const User = require('../models/User.schema');
const Counter = require('../models/Counter.schema');

/*Helper function to safely strip the password from the user object 
before returning it to the controller.
Mongoose documents need to be converted to plain objects (.toObject()) first.*/
const stripPassword = (userDoc) => {
    const userObj = userDoc.toObject();
    delete userObj.password;
    return userObj;
};

/*
 Retrieves a user by their ID.
 {string} id - The MongoDB ObjectId as a string.
 returns {Object|null} The user object without the password, or null if not found.
*/
const getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) return null;
        return stripPassword(user);
    } catch (error) {
        // If the ID is not a valid ObjectId format, Mongoose throws a CastError
        return null;
    }
};

/*
Creates a new user in the database.
Checks for existing username/email/phone to avoid duplicates.
Generates an auto-incrementing cppId safely using the Counter collection.
userData - The data for the new user.
returns the created user, or an object containing { conflict: 'fieldName' }.
*/
const createUser = async (userData) => {
    // Check for conflicts (duplicates)
    const existingUsername = await User.findOne({ username: userData.username });
    if (existingUsername) return { conflict: 'username' };

    const existingEmail = await User.findOne({ email: userData.email });
    if (existingEmail) return { conflict: 'email' };

    if (userData.phone) {
        const existingPhone = await User.findOne({ phone: userData.phone });
        if (existingPhone) return { conflict: 'phone' };
    }

    // Generate the next cppId atomically
    // findByIdAndUpdate with $inc is completely thread-safe in MongoDB
    const counter = await Counter.findByIdAndUpdate(
        'user_cpp_id',           // The unique name of our sequence
        { $inc: { seq: 1 } },    // Increment the sequence by 1
        { new: true, upsert: true } // Return the updated doc, create it if it doesn't exist
    );

    // Create the new user with the generated cppId
    const newUser = new User({
        cppId: counter.seq,
        username: userData.username,
        password: userData.password, 
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || null,
        address: userData.address,
        isRestaurantOwner: userData.isRestaurantOwner || false,
    });

    await newUser.save();
    return stripPassword(newUser);
};

/*
 Finds a user whose username AND password both match.
 returns The user without password, or null if invalid.
 */
const getUserByCredentials = async (username, password) => {
    const user = await User.findOne({ username, password });
    if (!user) return null;
    return stripPassword(user);
};

/*
 Returns the C++ integer ID for a given Node ObjectId.
 returns The cppId, or null if not found.
*/
const getUserCppId = async (nodeId) => {
    try {
        const user = await User.findById(nodeId).select('cppId');
        return user ? user.cppId : null;
    } catch (error) {
        return null;
    }
};


// Returns an array of cppIds for all registered users.
const getAllUserCppIds = async () => {
    // .select('cppId') ensures we only pull that specific field from the DB to save memory
    const users = await User.find().select('cppId');
    return users.map(u => u.cppId);
};

module.exports = {
    getUserById,
    createUser,
    getUserByCredentials,
    getUserCppId,
    getAllUserCppIds,
};