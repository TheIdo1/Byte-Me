// src/webServer/services/restaurants.service.js
const Restaurant = require('../models/restaurants.schema');

/*
 Retrieves all restaurants from the database.
 returns {Array} All restaurant documents.
*/
const getAllRestaurants = async () => {
    return await Restaurant.find();
};

/*
 Retrieves a single restaurant by its MongoDB ObjectId.
 {string} id - The restaurant's ObjectId as a string.
 returns {Object|null} The restaurant document, or null if not found / invalid id.
*/
const getRestaurantById = async (id) => {
    try {
        return await Restaurant.findById(id);
    } catch (error) {
        // If the ID is not a valid ObjectId format, Mongoose throws a CastError
        return null;
    }
};

/*
 Creates a new restaurant and saves it to the database.
 restaurantData - The validated restaurant fields from the controller.
 returns {Object} The newly created restaurant document.
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
 Partially updates a restaurant by its MongoDB ObjectId.
 {string} id - The restaurant's ObjectId.
 {Object} updateData - Fields to update (already sanitized by the validator middleware).
 returns {Object|null} The updated restaurant document, or null if not found.
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
 {string} id - The restaurant's ObjectId.
 returns {boolean} True if deleted, false if not found.
*/
const deleteRestaurant = async (id) => {
    try {
        const result = await Restaurant.findByIdAndDelete(id);
        return result !== null;
    } catch (error) {
        return false;
    }
};

/*
 Appends a product ObjectId to the restaurant's products array.
 Uses $push to keep the operation atomic.
 returns {boolean} True if the restaurant was found and updated.
*/
const addProductToRestaurant = async (restaurantId, productId) => {
    try {
        const result = await Restaurant.findByIdAndUpdate(
            restaurantId, { $push: { products: productId } }
        );
        return result !== null;
    } catch (error) {
        return false;
    }
};

/*
 Removes a product ObjectId from the restaurant's products array.
 Uses $pull to remove by value without needing the index.
 returns {boolean} True if the restaurant was found and updated.
*/
const removeProductFromRestaurant = async (restaurantId, productId) => {
    try {
        const result = await Restaurant.findByIdAndUpdate(
            restaurantId, { $pull: { products: productId } }
        );
        return result !== null;
    } catch (error) {
        return false;
    }
};

/*
 Case-insensitive search across restaurant name and description.
 Special regex characters in the query are escaped to prevent injection.
 {string} query - The search term from the sanitized request.
 returns {Array} Matching restaurant documents.
*/
const searchRestaurants = async (query) => {
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
