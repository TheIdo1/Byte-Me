const restaurantsModel = require('../models/restaurants.model');

//Returns all restaurants
const getAllRestaurants = (req, res) => {
    res.json(restaurantsModel.getAllRestaurants());
}

//Returns a single restaurant by ID. Returns 404 if not found.
const getRestaurantById = (req, res) => {
    const restaurantId = req.params.rId;
    const restaurant = restaurantsModel.getRestaurantById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' })
    }
    res.status(200).json(restaurant)
}

const createRestaurant = (req, res) => {
    // validateCreateRestaurant middleware has already guaranteed that fields: name, category, address, phone, email
    // are present and have the correct types.
    
    // Extract the actual restaurant fields from the request body
    const { 
        name, 
        description,
        category, 
        authorizedUsers,
        phone,
        email,
        image,
        subcategories,
        address,
        products,
        rating,
        isSponsored,
        promotionalMessage

    } = req.body;

    // Build the clean data object exactly as the model expects it
    const cleanRestaurantData = { 
        name, 
        description,
        category, 
        authorizedUsers,
        phone,
        email,
        image,
        subcategories,
        address,
        products,
        rating,
        isSponsored,
        promotionalMessage
    };

    // Pass it to the model
    const newRestaurant = restaurantsModel.createRestaurant(cleanRestaurantData);
    
    // Return 201 Created. 
    res.status(201).location(`/api/restaurants/${newRestaurant.id}`).json(newRestaurant);
};

/*
Updates an existing restaurant.
Assumes that the validation middleware has already sanitized req.body,
ensuring it only contains allowed fields with proper data types.
*/
const updateRestaurant = (req, res) => {
    const restaurantId = req.params.rId;
    
    // Since the Validator already stripped out any illegal fields, 
    // req.body now contains ONLY clean, database-ready keys.
    const dbUpdates = req.body;

    // Check if the object is empty
    if (Object.keys(dbUpdates).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const updatedRestaurant = restaurantsModel.updateRestaurant(restaurantId, dbUpdates);

    if (!updatedRestaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.status(204).send();
};

//Deletes an restaurant by ID, Returns 404 if not found
const deleteRestaurant = (req,res) => {
    const restaurantId = req.params.rId;
    const isDeleted = restaurantsModel.deleteRestaurant(restaurantId);
    if (!isDeleted) {
        return res.status(404).json({ error: 'Restaurant not found' })
    }
    res.status(204).send()
}

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};