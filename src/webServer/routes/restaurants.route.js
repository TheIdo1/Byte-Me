// defines all endpoints for the /api/restaurants resource.
// each route applies the appropriate validation middleware before the controller.
const express = require('express');
const router = express.Router();

const restaurantsController = require('../controllers/restaurants.controller');
const { validateCreateRestaurant, validateRestaurantUpdate } = require('../middleware/validators/restaurantValidator');
const { validateAddressMiddleware, validateAddressOptional }= require('../middleware/validators/addressValidator')
const { requireAuth } = require('../middleware/auth'); // Import the authentication middleware


//route products to products.route
const productsRouter = require('./products.route');
router.use('/:rId/products', productsRouter);

router.route('/')
    .get(restaurantsController.getAllRestaurants)
    // Add requireAuth before the controller to protect this endpoint
    .post(requireAuth,validateCreateRestaurant, validateAddressMiddleware, restaurantsController.createRestaurant);


router.route('/:rId')
    .get(restaurantsController.getRestaurantById)
    // Add requireAuth to protect updates and deletions
    .patch(requireAuth,validateRestaurantUpdate, validateAddressOptional, restaurantsController.updateRestaurant)
    .delete(requireAuth,restaurantsController.deleteRestaurant);

module.exports = router;