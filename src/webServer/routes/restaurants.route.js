// defines all endpoints for the /api/restaurants resource.
// each route applies the appropriate validation middleware before the controller.
const express = require('express');
const router = express.Router();

const restaurantsController = require('../controllers/restaurants.controller');
const { validateCreateRestaurant, validateRestaurantUpdate } = require('../middleware/validators/restaurantValidator');
const { validateAddressMiddleware, validateAddressOptional }= require('../middleware/validators/addressValidator')

router.route('/')
    .get(restaurantsController.getAllOrders)
    .post(validateCreateRestaurant, validateAddressMiddleware, ordersController.createOrder);


router.route('/:id')
    .get(restaurantsController.getRestaurantById)
    .patch(validateRestaurantUpdate, validateAddressOptional, restaurantsController.updateRestaurant)
    .delete(restaurantsController.deleteRestaurant);

module.exports = router;