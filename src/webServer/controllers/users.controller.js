const usersModel = require('../models/users.model');


//Creates a new user from the registration form body.
const createUser = (req, res) => {
    const { username, password, firstName, lastName, email, phone, address, isRestaurantOwner } = req.body;

    const newUserData = { username, password, firstName, lastName, email, phone, address, isRestaurantOwner };

    const newUser = usersModel.createUser(newUserData);
    if (newUser?.conflict === 'username')
        return res.status(409).json({ error: 'Username is already taken.', field: 'username' });
    if (newUser?.conflict === 'email')
        return res.status(409).json({ error: 'Email is already taken.', field: 'email' });
    if (newUser?.conflict === 'phone')
        return res.status(409).json({ error: 'Phone number is already taken.', field: 'phone' });

    res.status(201).location(`/api/users/${newUser.id}`).json(newUser);
};

//Returns the public details of the user with the given ID.
const getUserById = (req, res) => {
    const userId = req.params.id;
    const user = usersModel.getUserById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
};

module.exports = {
    createUser,
    getUserById,
};
