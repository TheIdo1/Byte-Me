// models/restaurants.js
// currently manages the in-memory storage for restaurants and provides functions to interact with the data.

const { v4: uuidv4 } = require('uuid');

// In-memory array to store all restaurants. Resets when the server restarts.
const restaurants = [];


// Retrieves all restaurants from the memory.
const getAllRestaurants = () => {
    return restaurants;
};

/*
Retrieves a specific restaurant by its ID.
id - The ID of the restaurant to find.
The restaurant object if found, otherwise undefined.
*/
const getRestaurantById = (id) => {
    return restaurants.find(restaurant => restaurant.id === id);
};

/*
Creates a new restaurnt, constructs the required JSON structure, and saves it to memory
restaurantData - The data for the new restaurant (name, category, authorized users[ids], phone, email, address{}, products[ids])
return the newly created restaurant
*/
const createRestaurant = (restaurantData) => {

    // Constructing the restaurant object exactly as agreed upon
    const newRestaurant = {
        id: uuidv4(),
        name: restaurantData.name || '',
        description: restaurantData.description || '',
        category: restaurantData.category || '',
        authorizedUsers: restaurantData.authorizedUsers || [],
        phone: restaurantData.phone || '',
        email: restaurantData.email || '',
        address: {
            city: restaurantData.address.city || '',
            street: restaurantData.address.street || '',
            houseNum: restaurantData.address.houseNum || 0,
            floor: restaurantData.address.floor || 0,
            lat: restaurantData.lat || 32.071169922988354,
            long: restaurantData.long || 34.84453170435457
        },
        products: restaurantData.products || [], // this field is optional, initiate to empty list if undefined.
        rating: restaurantData.rating || 1,
        isSponsored: restaurantData.isSponsored ?? false,
        promotionalMessage : restaurantData.promotionalMessage || "Try Us"
    };

    // Save to in-memory array
    restaurants.push(newRestaurant);
    
    return newRestaurant;
};


// Updates an existing restaurant by its ID.
// id - The ID of the restaurant to update.
// updateData - The new data to apply to the restaurant.
// returns The updated restaurant object, or null if the restaurant was not found.
const updateRestaurant = (id, updateData) => {
    const restaurantIndex = restaurants.findIndex(restaurant => restaurant.id === id);
    
    if (restaurantIndex === -1) {
        return null; // restaurant not found
    }

    // Merges existing restaurant properties with incoming updates
    // any overlapping fields are overwritten by the new values.
    restaurants[restaurantIndex] = { ...restaurants[restaurantIndex], ...updateData };
    
    return restaurants[restaurantIndex];
};

/*
Deletes an restaurant from memory by its ID.
id - The ID of the restaurant to delete.
returns True if the restaurant was successfully deleted, false if not found.
*/
const deleteRestaurant = (id) => {
    const restaurantIndex = restaurants.findIndex(restaurant => restaurant.id === id);
    
    if (restaurantIndex === -1) {
        return false;
    }

    // Remove 1 element at the found index
    restaurants.splice(restaurantIndex, 1);
    return true;
};

/*
Adds a product ID to a restaurant's products array.
restaurantId - The ID of the restaurant.
productId - The ID of the newly created product.
returns True if successful, false if the restaurant was not found.
*/
const addProductToRestaurant = (restaurantId, productId) => {
    const restaurant = getRestaurantById(restaurantId);
    
    if (!restaurant) {
        return false;
    }

    // Push the new product ID into the array
    restaurant.products.push(productId);
    return true;
};

/*
Removes a product ID from a restaurant's products array.
restaurantId - The ID of the restaurant.
productId - The ID of the product to remove.
returns True if successful, false if the restaurant was not found.
*/
const removeProductFromRestaurant = (restaurantId, productId) => {
    const restaurant = getRestaurantById(restaurantId);
    
    if (!restaurant) {
        return false;
    }

    // Filter out the deleted product ID, keeping everything else
    restaurant.products = restaurant.products.filter(id => id !== productId);
    return true;
};

// Export the functions so the Controller can use them
module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    addProductToRestaurant,
    removeProductFromRestaurant
};