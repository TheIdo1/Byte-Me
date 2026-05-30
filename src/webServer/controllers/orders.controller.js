const ordersModel = require('../models/orders.model');

//Returns all orders
const getAllOrders = (req, res) => {
    res.json(ordersModel.getAllOrders());
}

//Returns a single order by ID. Returns 404 if not found.
const getOrderById = (req, res) => {
    const orderId = req.params.id;
    const order = ordersModel.getOrderById(orderId);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' })
    }
    res.status(200).json(order)
}

const createOrder = (req, res) => {
    // validateCreateOrder middleware has already guaranteed that all fields are present and have the correct types.
    const { customerId, restaurantId, orderedItems } = req.body;

    // Build the clean data object to pass to the model.
    // The model will add the UUID and current date on its side.
    const cleanOrderData = { customerId, restaurantId, orderedItems };

    const newOrder = ordersModel.createOrder(cleanOrderData);
    res.status(201).location(`/api/orders/${newOrder.id}`).json(newOrder);
};

/*
Updates an existing order.
Assumes that the validation middleware has already sanitized req.body,
ensuring it only contains allowed fields with proper data types.
*/
const updateOrder = (req, res) => {
    const orderId = req.params.id;
    
    // Extract the sanitized updates from the request body
    const updates = req.body;

    const updatedOrder = ordersModel.updateOrder(orderId, updates);

    // if the model returns null, it means no order was found with this UUID
    if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.status(204).send();
};

//Deletes an order by ID, Returns 404 if not found
const deleteOrder = (req,res) => {
    const orderId = req.params.id;
    const isDeleted = ordersModel.deleteOrder(orderId);
    if (!isDeleted) {
        return res.status(404).json({ error: 'Order not found' })
    }
    res.status(204).send()
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};