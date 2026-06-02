// routes/tokens.route.js
// Defines all endpoints for the /api/tokens resource.

const express = require('express');
const router = express.Router();

const tokensController = require('../controllers/tokens.controller');
const { validateCreateToken } = require('../middleware/validators/tokenValidator');

router.route('/')
    .post(validateCreateToken, tokensController.createToken);

module.exports = router;
