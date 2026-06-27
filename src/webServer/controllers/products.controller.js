const productsService = require('../services/products.service');
const restaurantsService = require('../services/restaurants.service');
const usersService = require('../services/users.service');
const { sendCommandToCpp } = require('../services/cppSocketService');

// Returns all products
const getAllProducts = async (_req, res) => {
    try {
        const products = await productsService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Returns all products for a specific restaurant
const getAllRestaurantProducts = async (req, res) => {
    try {
        const products = await productsService.getAllRestaurantProducts(req.params.rId);
        return res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Returns a single product by ID. Returns 404 if not found.
const getProductById = async (req, res) => {
    try {
        const productId = req.params.pId;
        const product = await productsService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);

        // C++ connection: notify recommendation engine that user viewed this product
        if (req.userId) {
            const userCppId = await usersService.getUserCppId(req.userId);

            // The user may have been deleted after the token was created.
            if (userCppId === null) {
                return;
            }
            const productCppId = product.cppId;

            sendCommandToCpp(`POST ${userCppId} ${productCppId}`)
                .then(response => {
                    if (!String(response).startsWith('2')) {
                        console.error(`C++ POST failed for userCppId ${userCppId}: ${response}`);
                        return sendCommandToCpp(`PATCH ${userCppId} ${productCppId}`)
                            .then(patchResponse => {
                                if (!String(patchResponse).startsWith('2')) {
                                    console.error(`C++ PATCH failed for userCppId ${userCppId}: ${patchResponse}`);
                                }
                            });
                    }
                })
                .catch(err => console.error(`C++ socket error for userCppId ${userCppId}: ${err.message ?? err}`));
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            price,
            image,
            extras,
            isExtra,
            isPopular
        } = req.body;

        const restaurantId = req.params.rId;

        const cleanProductData = {
            name,
            restaurantId,
            description,
            category,
            price,
            image,
            extras,
            isExtra,
            isPopular
        };

        const newProduct = await productsService.createProduct(cleanProductData);

        // Keep the restaurant's products list in sync
        await restaurantsService.addProductToRestaurant(restaurantId, newProduct.id);

        res.status(201).location(`/api/products/${newProduct.id}`).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/*
 Updates an existing product.
 Assumes that the validation middleware has already sanitized req.body.
*/
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pId;
        const dbUpdates = req.body;

        if (Object.keys(dbUpdates).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update' });
        }

        const updatedProduct = await productsService.updateProduct(productId, dbUpdates);

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Deletes a product by ID. Returns 404 if not found.
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pId;
        const product = await productsService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await productsService.deleteProduct(productId);
        await restaurantsService.removeProductFromRestaurant(product.restaurantId, productId);

        const productCppId = product.cppId;
        const allUserCppIds = await usersService.getAllUserCppIds();
        Promise.allSettled(
            allUserCppIds.map(userCppId =>
                sendCommandToCpp(`DELETE ${userCppId} ${productCppId}`)
            )
        ).then(results => {
            results.forEach((result, i) => {
                if (result.status === 'rejected') {
                    console.error(`C++ DELETE failed for userCppId ${allUserCppIds[i]}: ${result.reason?.message ?? result.reason}`);
                }
            });
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllRestaurantProducts
};
