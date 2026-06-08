// defines all endpoints for the /api/orders resource.
// each route applies the appropriate validation middleware before the controller.
const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/orders.controller');
const { validateCreateOrder, validateOrderUpdate } = require('../middleware/validators/orderValidator');
const { requireAuth } = require('../middleware/auth'); // Import the authentication middleware

router.route('/')
    .get(ordersController.getAllOrders)
    // requireAuth to the POST route to ensure only logged-in users can order
    .post(requireAuth, validateCreateOrder, ordersController.createOrder);

router.route('/:id')
    .get(ordersController.getOrderById)
    // Add protection to update/delete  ensure only logged-in users can perform them
    .patch(requireAuth, validateOrderUpdate, ordersController.updateOrder)
    .delete(requireAuth, ordersController.deleteOrder);

module.exports = router;