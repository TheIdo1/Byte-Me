// src/webServer/services/products.service.js
const Product = require('../models/products.schema');
const Counter = require('../models/counter.schema');

/*
 Retrieves all products from the database across all restaurants.
 returns {Array} All product documents.
*/
const getAllProducts = async () => {
    return await Product.find();
};

/*
 Retrieves all products belonging to a specific restaurant.
 {string} restaurantId - The parent restaurant's ObjectId as a string.
 returns {Array} Product documents for that restaurant.
*/
const getAllRestaurantProducts = async (restaurantId) => {
    return await Product.find({ restaurantId });
};

/*
 Retrieves a single product by its MongoDB ObjectId.
 {string} id - The product's ObjectId as a string.
 returns {Object|null} The product document, or null if not found / invalid id.
*/
const getProductById = async (id) => {
    try {
        return await Product.findById(id);
    } catch (error) {
        // If the ID is not a valid ObjectId format, Mongoose throws a CastError
        return null;
    }
};

/*
 Creates a new product and saves it to the database.
 Generates an auto-incrementing cppId using the Counter collection so the
 C++ recommendation engine can reference this product by a stable integer.
 findByIdAndUpdate with $inc is thread-safe — no race conditions under concurrent requests.
 {Object} productData - The validated product fields from the controller.
 returns {Object} The newly created product document.
*/
const createProduct = async (productData) => {
    const counter = await Counter.findByIdAndUpdate(
        'product_cpp_id',
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true }
    );

    const newProduct = new Product({
        cppId: counter.seq,
        restaurantId: productData.restaurantId,
        name: productData.name,
        description: productData.description || '',
        category: productData.category,
        price: productData.price || 0,
        image: productData.image || '',
        extras: productData.extras || [],
        isExtra: productData.isExtra || false,
        isPopular: productData.isPopular || false
    });

    await newProduct.save();
    return newProduct;
};

/*
 Partially updates a product by its MongoDB ObjectId.
 {string} id - The product's ObjectId.
 {Object} updateData - Fields to update (already sanitized by the validator middleware).
 returns {Object|null} The updated product document, or null if not found.
*/
const updateProduct = async (id, updateData) => {
    try {
        return await Product.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
        return null;
    }
};

/*
 Deletes a product by its MongoDB ObjectId.
 {string} id - The product's ObjectId.
 returns {boolean} True if deleted, false if not found.
*/
const deleteProduct = async (id) => {
    try {
        const result = await Product.findByIdAndDelete(id);
        return result !== null;
    } catch (error) {
        return false;
    }
};

/*
 Returns the C++ integer ID for a given MongoDB ObjectId string.
 Used by the controller to notify the C++ recommendation engine when a product is viewed.
 {string} nodeId - The product's MongoDB ObjectId as a string.
 returns {number|null} The cppId, or null if not found.
*/
const getProductCppId = async (nodeId) => {
    try {
        const product = await Product.findById(nodeId).select('cppId');
        return product ? product.cppId : null;
    } catch (error) {
        return null;
    }
};

/*
 Case-insensitive search across product name and description.
 Special regex characters in the query are escaped to prevent injection.
 {string} query - The search term from the sanitized request.
 returns {Array} Matching product documents.
*/
const searchProducts = async (query) => {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    return await Product.find({
        $or: [{ name: regex }, { description: regex }]
    });
};

module.exports = {
    getAllProducts,
    getAllRestaurantProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductCppId,
    searchProducts
};
