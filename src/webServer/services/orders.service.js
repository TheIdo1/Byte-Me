// src/webServer/services/orders.service.js
const Order = require('../models/orders.schema');

/*
 Retrieves all orders from the database.
*/
const getAllOrders = async () => {
    return await Order.find();
};

/*
 Retrieves a specific order by its ID.
 {string} id - The MongoDB ObjectId as a string.
 returns {Object|null} The order object, or null if not found.
*/
const getOrderById = async (id) => {
    try {
        const order = await Order.findById(id);
        return order;
    } catch (error) {
        // If the ID is not a valid ObjectId format, Mongoose throws a CastError
        return null;
    }
};

/*
 Creates a new order in the database.
 Constructs the required custom date object and saves it.
 orderData - The data for the new order (customerId, restaurantId, orderedItems)
 returns the newly created order
*/
const createOrder = async (orderData) => {
    const now = new Date();
    
    const newOrder = new Order({
        date: {
            day: now.getDate(),
            month: now.getMonth() + 1, // JavaScript months are 0-indexed
            year: now.getFullYear(),
            hour: now.getHours(),
            minute: now.getMinutes(),
            second: now.getSeconds()
        },
        customerId: orderData.customerId,
        restaurantId: orderData.restaurantId, 
        orderedItems: orderData.orderedItems
    });

    await newOrder.save();
    return newOrder;
};

/*
 Updates an existing order by its ID.
 id - The ID of the order to update.
 updateData - The new data to apply to the order.
 returns The updated order object, or null if the order was not found.
*/
const updateOrder = async (id, updateData) => {
    try {
        // { new: true } tells Mongoose to return the updated document, not the old one
        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
        return updatedOrder;
    } catch (error) {
        return null; // Order not found or invalid ID format
    }
};

/*
 Deletes an order from the database by its ID.
 id - The ID of the order to delete.
 returns True if the order was successfully deleted, false if not found.
*/
const deleteOrder = async (id) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        // If deletedOrder is not null, the deletion was successful
        return !!deletedOrder;
    } catch (error) {
        return false;
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};