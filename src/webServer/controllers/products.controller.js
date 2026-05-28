const productsModel = require('../models/products.model');

//Returns all products
const getAllProducts = (req, res) => {
    res.json(productsModel.getAllProducts());
}

//Returns a single product by ID. Returns 404 if not found.
const getProductById = (req, res) => {
    const productId = req.params.pId;
    const product = productsModel.getProductById(productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' })
    }
    res.status(200).json(product)
}

const createProduct = (req, res) => {
    // validateCreateProduct middleware has already guaranteed that fields: name, category, address, phone, email
    // are present and have the correct types.
    // Extract the actual product fields from the request body
    const { 
        name, 
        description,
        category, 
        price,
        image,
        extras 
    } = req.body;

    const restaurantId = req.params.rId

    // Build the clean data object exactly as the model expects it
    const cleanProductData = { 
        name, 
        restaurantId,
        description,
        category, 
        price,
        image,
        extras  
    };

    // Pass it to the model
    const newProduct = productsModel.createProduct(cleanProductData);
    
    // Return 201 Created. 
    res.status(201).location(`/api/products/${newProduct.id}`).json(newProduct);
};

/*
Updates an existing product.
Assumes that the validation middleware has already sanitized req.body,
ensuring it only contains allowed fields with proper data types.
*/
const updateProduct = (req, res) => {
    const productId = req.params.pId;
    
    // Since the Validator already stripped out any illegal fields, 
    // req.body now contains ONLY clean, database-ready keys.
    const dbUpdates = req.body;

    // Check if the object is empty
    if (Object.keys(dbUpdates).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const updatedProduct = productsModel.updateProduct(productId, dbUpdates);

    if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
};

//Deletes an product by ID, Returns 404 if not found
const deleteProduct = (req,res) => {
    const productId = req.params.pId;
    const isDeleted = productsModel.deleteProduct(productId);
    if (!isDeleted) {
        return res.status(404).json({ error: 'Product not found' })
    }
    res.status(204).send()
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};