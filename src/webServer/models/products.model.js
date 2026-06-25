// src/webServer/models/products.model.js
const Product = require('./products.schema');
const Counter = require('./counter.schema');

// Retrieves all products from the database.
const getAllProducts = async () => {
    return await Product.find();
};

// Retrieves all products belonging to a specific restaurant.
const getAllRestaurantProducts = async (restaurantId) => {
    return await Product.find({ restaurantId });
};

/*
 Retrieves a specific product by its MongoDB ObjectId.
 Returns the product document, or null if not found.
*/
const getProductById = async (id) => {
    try {
        return await Product.findById(id);
    } catch (error) {
        return null;
    }
};

/*
 Creates a new product in the database.
 Generates an auto-incrementing cppId using the Counter collection.
 Returns the newly created product.
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
 Updates an existing product by its MongoDB ObjectId.
 Returns the updated product, or null if not found.
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
 Returns true if deleted, false if not found.
*/
const deleteProduct = async (id) => {
    try {
        const result = await Product.findByIdAndDelete(id);
        return result !== null;
    } catch (error) {
        return false;
    }
};

// Returns the C++ integer ID for a given MongoDB ObjectId, or null if not found.
const getProductCppId = async (nodeId) => {
    try {
        const product = await Product.findById(nodeId).select('cppId');
        return product ? product.cppId : null;
    } catch (error) {
        return null;
    }
};

// Searches products by name or description using a case-insensitive regex.
const searchProducts = async (query) => {
    // Escape special regex characters to prevent injection
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
