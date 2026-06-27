// src/webServer/controllers/orders.controller.js
const ordersService = require('../services/orders.service');

// Returns all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await ordersService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Failed to get all orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Returns only the orders belonging to the authenticated user
const getMyOrders = async (req, res) => {
    try {
        // Fetch all orders and filter them
        // Note: For better performance in production, a dedicated query in the service 
        // like Order.find({ customerId: req.userId }) would be preferred.
        const all = await ordersService.getAllOrders();
        res.json(all.filter(o => o.customerId === req.userId));
    } catch (error) {
        console.error('Failed to get user orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Returns a single order by ID. Returns 404 if not found.
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await ordersService.getOrderById(orderId);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Failed to get order by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createOrder = async (req, res) => {
    try {
        // The middleware 'validateCreateOrder' guarantees that 
        // restaurantId and orderedItems exist and are valid
        const { restaurantId, orderedItems } = req.body;

        // SECURITY: The customerId is derived from the JWT payload via the 'requireAuth' middleware
        // We ignore any attempt by the client to specify a customerId in the body
        const customerId = req.userId;

        // Build the clean data object to pass to the service.
        const cleanOrderData = { customerId, restaurantId, orderedItems };

        const newOrder = await ordersService.createOrder(cleanOrderData);
        res.status(201).location(`/api/orders/${newOrder.id}`).json(newOrder);
    } catch (error) {
        console.error('Failed to create order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

/*
 Updates an existing order.
 Assumes that the validation middleware has already sanitized req.body,
 ensuring it only contains allowed fields with proper data types.
*/
const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        
        // Extract the sanitized updates from the request body
        const updates = req.body;

        const updatedOrder = await ordersService.updateOrder(orderId, updates);

        // if the service returns null, it means no order was found with this ID
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Failed to update order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};

// Deletes an order by ID, Returns 404 if not found
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const isDeleted = await ordersService.deleteOrder(orderId);
        
        if (!isDeleted) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

module.exports = {
    getAllOrders,
    getMyOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};