// routes/tokens.route.js
// Defines all endpoints for the /api/tokens resource.

const express = require('express');
const router = express.Router();

const auth = require('../auth');
const { validateCreateToken } = require('../middleware/validators/tokenValidator');

router.route('/')
    .post(validateCreateToken, auth.login);

module.exports = router;
