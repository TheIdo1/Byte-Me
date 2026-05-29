// models/products.js
// currently manages the in-memory storage for products and provides functions to interact with the data.

const { v4: uuidv4 } = require('uuid');

// In-memory array to store all products. Resets when the server restarts.
const products = [];


// Retrieves all products from the memory.
const getAllProducts = () => {
    return products;
};

/*
Retrieves a specific product by its ID.
id - The ID of the product to find.
The product object if found, otherwise undefined.
*/
const getProductById = (id) => {
    return products.find(product => product.id === id);
};

/*
Creates a new restaurnt, constructs the required JSON structure, and saves it to memory
productData - The data for the new product (name, category, authorized users[ids], phone, email, address{}, products[ids])
return the newly created product
*/
const createProduct = (productData) => {

    // Constructing the product object exactly as agreed upon
    const newProduct = {
        id: uuidv4(),
        restaurantId: productData.restaurantId || '',
        name: productData.name || '',
        description: productData.description || '',
        category: productData.category || '',
        price: productData.price || 0,
        image: productData.image || '',
        extras: productData.extras || [] // this field is optional, initiate to empty list if undefined.
    };

    // Save to in-memory array
    products.push(newProduct);
    
    return newProduct;
};


// Updates an existing product by its ID.
// id - The ID of the product to update.
// updateData - The new data to apply to the product.
// returns The updated product object, or null if the product was not found.
const updateProduct = (id, updateData) => {
    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
        return null; // product not found
    }

    // Merges existing product properties with incoming updates
    // any overlapping fields are overwritten by the new values.
    products[productIndex] = { ...products[productIndex], ...updateData };
    
    return products[productIndex];
};

/*
Deletes an product from memory by its ID.
id - The ID of the product to delete.
returns True if the product was successfully deleted, false if not found.
*/
const deleteProduct = (id) => {
    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
        return false;
    }

    // Remove 1 element at the found index
    products.splice(productIndex, 1);
    return true;
};

// Export the functions so the Controller can use them
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};