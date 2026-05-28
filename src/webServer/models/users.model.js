// models/users.model.js
// Manages in-memory storage for users and provides functions to interact with the data.

const { v4: uuidv4 } = require('uuid');

// In-memory array to store all users. Resets when the server restarts.
const users = [];

// Internal helper — strips password before returning a user to the outside world.
const stripPassword = (user) => {
    const { password, ...safeUser } = user;
    return safeUser;
};

// Retrieves a specific user by their ID, null if not found.
const getUserById = (id) => {
    const user = users.find(user => user.id === id);
    if (!user) return null;
    return stripPassword(user);
};

// Creates a new user and saves it to memory.
// Returns the new user (without password), or null if the username is already taken.
const createUser = (userData) => {
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

    users.push(newUser);
    return stripPassword(newUser);
};

// Finds a user whose username AND password both match.
// Returns the user (without password), or null if credentials are invalid.
const getUserByCredentials = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return null;
    return stripPassword(user);
};

module.exports = {
    getUserById,
    createUser,
    getUserByCredentials,
};
