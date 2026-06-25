// src/webServer/controllers/users.controller.js
const usersService = require('../services/users.service');

/*
Creates a new user from the registration form body.
The validation middleware already checked the request body before this point.
*/
const createUser = async (req, res) => {
    try {
        const {
            username,
            password,
            firstName,
            lastName,
            email,
            phone,
            address,
            isRestaurantOwner
        } = req.body;

        const newUserData = {
            username,
            password,
            firstName,
            lastName,
            email,
            phone,
            address,
            isRestaurantOwner
        };

        // The service now saves the user in MongoDB.
        const newUser = await usersService.createUser(newUserData);

        // Keep all existing conflict checks and HTTP responses.
        if (newUser?.conflict === 'username') {
            return res.status(409).json({
                error: 'Username is already taken.',
                field: 'username'
            });
        }

        if (newUser?.conflict === 'email') {
            return res.status(409).json({
                error: 'Email is already taken.',
                field: 'email'
            });
        }

        if (newUser?.conflict === 'phone') {
            return res.status(409).json({
                error: 'Phone number is already taken.',
                field: 'phone'
            });
        }

        return res
            .status(201)
            .location(`/api/users/${newUser.id}`)
            .json(newUser);

    } catch (error) {
        console.error('Failed to create user:', error);

        return res.status(500).json({
            error: 'Failed to create user.'
        });
    }
};

/*
Returns the public details of the user with the given ID.
*/
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await usersService.getUserById(userId);

        // Keep the existing not-found behavior.
        if (!user) {
            return res.status(404).json({
                error: 'User not found.'
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error('Failed to retrieve user:', error);

        return res.status(500).json({
            error: 'Failed to retrieve user.'
        });
    }
};

module.exports = {
    createUser,
    getUserById,
};