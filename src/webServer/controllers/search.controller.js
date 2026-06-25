const restaurantsModel = require('../models/restaurants.model');
const productsModel = require('../models/products.model');

// Handles the search request.
// Retrieves the sanitized query from the request object and searches both restaurants and products
// in MongoDB using a case-insensitive regex on 'name' and 'description' fields.
const search = async (req, res) => {
    try {
        const query = req.cleanQuery;

        const [matchedRestaurants, matchedProducts] = await Promise.all([
            restaurantsModel.searchRestaurants(query),
            productsModel.searchProducts(query)
        ]);

        res.status(200).json({
            restaurants: matchedRestaurants,
            products: matchedProducts
        });

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error during search" });
    }
};

module.exports = { search };
