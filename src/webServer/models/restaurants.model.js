// src/webServer/models/restaurants.model.js
const Restaurant = require('./restaurants.schema');

// Retrieves all restaurants from the database.
const getAllRestaurants = async () => {
    return await Restaurant.find();
};

/*
 Retrieves a specific restaurant by its MongoDB ObjectId.
 Returns the restaurant document, or null if not found.
*/
const getRestaurantById = async (id) => {
    try {
        return await Restaurant.findById(id);
    } catch (error) {
        return null;
    }
};

/*
 Creates a new restaurant in the database.
 Returns the newly created restaurant.
*/
const createRestaurant = async (restaurantData) => {
    const newRestaurant = new Restaurant({
        name: restaurantData.name,
        description: restaurantData.description || '',
        category: restaurantData.category,
        authorizedUsers: restaurantData.authorizedUsers || [],
        phone: restaurantData.phone,
        email: restaurantData.email,
        image: restaurantData.image || '',
        subcategories: restaurantData.subcategories || [],
        address: restaurantData.address,
        products: restaurantData.products || [],
        rating: restaurantData.rating || 1,
        isSponsored: restaurantData.isSponsored ?? false,
        promotionalMessage: restaurantData.promotionalMessage || 'Try Us'
    });

    await newRestaurant.save();
    return newRestaurant;
};

/*
 Updates an existing restaurant by its MongoDB ObjectId.
 Returns the updated restaurant, or null if not found.
*/
const updateRestaurant = async (id, updateData) => {
    try {
        return await Restaurant.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
        return null;
    }
};

/*
 Deletes a restaurant by its MongoDB ObjectId.
 Returns true if deleted, false if not found.
*/
const deleteRestaurant = async (id) => {
    try {
        const result = await Restaurant.findByIdAndDelete(id);
        return result !== null;
    } catch (error) {
        return false;
    }
};

// Appends a product ID string to the restaurant's products array.
const addProductToRestaurant = async (restaurantId, productId) => {
    try {
        const result = await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $push: { products: productId } }
        );
        return result !== null;
    } catch (error) {
        return false;
    }
};

// Removes a product ID string from the restaurant's products array.
const removeProductFromRestaurant = async (restaurantId, productId) => {
    try {
        const result = await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $pull: { products: productId } }
        );
        return result !== null;
    } catch (error) {
        return false;
    }
};

// Searches restaurants by name or description using a case-insensitive regex.
const searchRestaurants = async (query) => {
    // Escape special regex characters to prevent injection
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    return await Restaurant.find({
        $or: [{ name: regex }, { description: regex }]
    });
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    addProductToRestaurant,
    removeProductFromRestaurant,
    searchRestaurants
};
