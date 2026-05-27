// routes/users.js
// Defines all endpoints for the /api/users resource.
const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const { validateCreateUser } = require('../middleware/validators/userValidator');
const { validateAddressMiddleware } = require('../middleware/validators/addressValidator');

router.route('/')
    .post(validateCreateUser, validateAddressMiddleware, usersController.createUser);

router.route('/:id')
    .get(usersController.getUserById);

module.exports = router;
