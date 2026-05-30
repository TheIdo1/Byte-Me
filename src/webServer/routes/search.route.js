const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const { validateSearchQuery } = require('../middleware/validators/searchValidator');

// defines all endpoints for the /api/search/:query resource
// The validateSearchQuery middleware is executed first to ensure the query is safe
// If validation passes, the searchController handles the actual filtering logic
router.route('/:query')
    .get(validateSearchQuery, searchController.search);

module.exports = router;