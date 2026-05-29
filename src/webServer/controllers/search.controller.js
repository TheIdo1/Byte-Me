const restaurantsModel = require('../models/restaurants.model');
const productsModel = require('../models/products.model'); 


// Handles the search request.
// Retrieves the sanitized query from the request object and filters both restaurants and products
// The search is case-insensitive and checks both 'name' and 'description' fields
const search = (req, res) => {
    try {
        // get the already validated and sanitized query handled by searchValidator middleware
        const query = req.cleanQuery;

        // Fetch all data, defaulting to empty arrays if the models return undefined
        const allRestaurants = restaurantsModel.getAllRestaurants() || [];
        const allProducts = productsModel.getAllProducts() || [];

        // filter restaurants: match if the query is a substring of the name or description
        const matchedRestaurants = allRestaurants.filter(restaurant => {
            // extract fields and convert to string to prevent TypeErrors
            const name = restaurant.name ? String(restaurant.name).toLowerCase() : '';
            const desc = restaurant.description ? String(restaurant.description).toLowerCase() : '';
            
            return name.includes(query) || desc.includes(query);
        });

        // filter products: match if the query is a substring of the name or description
        const matchedProducts = allProducts.filter(product => {
            // extract fields and convert to string to prevent TypeErrors
            const name = product.name ? String(product.name).toLowerCase() : '';
            const desc = product.description ? String(product.description).toLowerCase() : '';
            
            return name.includes(query) || desc.includes(query);
        });

        // return the filtered results successfully
        res.status(200).json({
            restaurants: matchedRestaurants,
            products: matchedProducts
        });
        
    } catch (error) {
        // log the error for backend debugging and return a generic 500 error to the client
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error during search" });
    }
};

module.exports = { search };