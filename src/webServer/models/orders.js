// models/orders.js
// currently manages the in-memory storage for orders and provides functions to interact with the data.

const { v4: uuidv4 } = require('uuid');

// In-memory array to store all orders. Resets when the server restarts.
const orders = [];


// Retrieves all orders from the memory.
const getAllOrders = () => {
    return orders;
};

/*
Retrieves a specific order by its ID.
id - The ID of the order to find.
The order object if found, otherwise undefined.
*/
const getOrderById = (id) => {
    return orders.find(order => order.id === id);
};

/*
Creates a new order, constructs the required JSON structure, and saves it to memory
orderData - The data for the new order (customer, restaurant, orderedItems)
return the newly created order
*/
const createOrder = (orderData) => {
    const now = new Date();
    
    // Constructing the order object exactly as agreed upon
    const newOrder = {
        id: uuidv4(),
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
    };

    // Save to in-memory array
    orders.push(newOrder);
    
    return newOrder;
};


// Updates an existing order by its ID.
// id - The ID of the order to update.
// updateData - The new data to apply to the order.
// returns The updated order object, or null if the order was not found.
const updateOrder = (id, updateData) => {
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
        return null; // Order not found
    }

    // Merges existing order properties with incoming updates
    // any overlapping fields are overwritten by the new values.
    orders[orderIndex] = { ...orders[orderIndex], ...updateData };
    
    return orders[orderIndex];
};

/*
Deletes an order from memory by its ID.
id - The ID of the order to delete.
returns True if the order was successfully deleted, false if not found.
*/
const deleteOrder = (id) => {
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
        return false;
    }

    // Remove 1 element at the found index
    orders.splice(orderIndex, 1);
    return true;
};

// Export the functions so the Controller can use them
module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};