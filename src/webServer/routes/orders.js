// defines all endpoints for the /api/orders resource.
// each route applies the appropriate validation middleware before the controller.
const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/orders');
const { validateCreateOrder, validateOrderUpdate } = require('../middleware/validators/orderValidator');

router.route('/')
    .get(ordersController.getAllOrders)
    .post(validateCreateOrder, ordersController.createOrder);

router.route('/:id')
    .get(ordersController.getOrderById)
    .patch(validateOrderUpdate, ordersController.updateOrder)
    .delete(ordersController.deleteOrder);

module.exports = router;