// routes/products.js
const express = require('express');

// mergeParams allows this router to access the :rId from the parent router's URL
const router = express.Router({ mergeParams: true }); 

const productsController = require('../controllers/products.controller');
const { requireAuth, optionalAuth } = require('../middleware/auth');// Import the authentication middleware

const { validateCreateProduct, validateProductUpdate } = require('../middleware/validators/productValidator');

// This resolves to: /api/restaurants/:rId/products/
router.route('/')
    .get(productsController.getAllRestaurantProducts)
    // POST is protected because it creates new products
    .post(requireAuth,validateCreateProduct, productsController.createProduct);

// This resolves to: /api/restaurants/:rId/products/:pId
router.route('/:pId')
// PATCH and DELETE are protected. GET remains optionalAuth
    .get(optionalAuth, productsController.getProductById)
    .patch(requireAuth, validateProductUpdate, productsController.updateProduct)
    .delete(requireAuth, productsController.deleteProduct);

module.exports = router;