// routes/products.js
const express = require('express');

// mergeParams allows this router to access the :rId from the parent router's URL
const router = express.Router({ mergeParams: true }); 

const productsController = require('../controllers/products.controller');
const { optionalAuth } = require('../middleware/auth');

const { validateCreateProduct, validateProductUpdate } = require('../middleware/validators/productValidator');

// This resolves to: /api/restaurants/:rId/products/
router.route('/')
    .get(productsController.getAllProducts)
    .post(validateCreateProduct, productsController.createProduct);

// This resolves to: /api/restaurants/:rId/products/:pId
router.route('/:pId')
    .get(optionalAuth, productsController.getProductById)
    .patch(validateProductUpdate, productsController.updateProduct)
    .delete(productsController.deleteProduct);

module.exports = router;