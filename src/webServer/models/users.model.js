// models/users.model.js
// Manages in-memory storage for users and provides functions to interact with the data.

const { v4: uuidv4 } = require('uuid');

// In-memory array to store all users. Resets when the server restarts.
const users = [];


//Retrieves a specific user by their ID, null if not found
const getUserById = (id) => {
    const user = users.find(user => user.id === id);
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
};


//Creates a new user, constructs the required JSON structure, and saves it to memory.
const createUser = (userData) => {
    // Enforce username uniqueness
    if (users.find(user => user.username === userData.username)) {
        return null;
    }

    const newUser = {
        id: uuidv4(),
        username: userData.username,
        password: userData.password, // plain text for now
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        address: {
            city:     userData.address.city,
            street:   userData.address.street,
            houseNum: userData.address.houseNum,
            floor:    userData.address.floor,
        },
    };

    // Save to in-memory array
    users.push(newUser);

    // Return user data without password
    const { password, ...safeUser } = newUser;
    return safeUser;
};

module.exports = {
    getUserById,
    createUser,
};
