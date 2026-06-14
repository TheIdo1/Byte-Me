// models/users.model.js
// Manages in-memory storage for users and provides functions to interact with the data.

const { v4: uuidv4 } = require('uuid');

// In-memory array to store all users. Resets when the server restarts.
const users = [];
let nextCppId = 1;

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
// Returns the new user (without password), or { conflict: <field> } on duplicate.
const createUser = (userData) => {
    if (users.find(u => u.username === userData.username))
        return { conflict: 'username' };
    if (users.find(u => u.email === userData.email))
        return { conflict: 'email' };
    if (userData.phone && users.find(u => u.phone === userData.phone))
        return { conflict: 'phone' };

    const newUser = {
        id: uuidv4(),
        cppId: nextCppId++,
        username: userData.username,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || null,
        address: {
            city:     userData.address.city,
            street:   userData.address.street,
            houseNum: userData.address.houseNum,
            floor:    userData.address.floor,
            lat:      userData.address.lat,
            long:     userData.address.long,
        },
        isRestaurantOwner: userData.isRestaurantOwner || false,
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

// Returns the C++ integer ID for a given Node UUID, or null if not found.
const getUserCppId = (nodeId) => {
    const user = users.find(u => u.id === nodeId);
    return user ? user.cppId : null;
};

// Returns the cppId of every registered user.
const getAllUserCppIds = () => users.map(u => u.cppId);

module.exports = {
    getUserById,
    createUser,
    getUserByCredentials,
    getUserCppId,
    getAllUserCppIds,
};
