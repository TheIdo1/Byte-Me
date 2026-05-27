const restaurantsModel = require('../models/restaurants.model');

//Returns all restaurants
const getAllRestaurants = (req, res) => {
    res.json(restaurantsModel.getAllRestaurants());
}

//Returns a single restaurant by ID. Returns 404 if not found.
const getRestaurantById = (req, res) => {
    const restaurantId = req.params.id;
    const restaurant = restaurantsModel.getRestaurantById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' })
    }
    res.status(200).json(restaurant)
}

const createRestaurant = (req, res) => {
    // validateCreateRestaurant middleware has already guaranteed that fields: name, category, adress, phone, email
    // are present and have the correct types.
    
    // Extract the actual restaurant fields from the request body
    const { 
        restaurantName, 
        restaurantDescription,
        restaurantCategory, 
        restaurantAuthorizedUsers,
        restaurantPhone,
        restaurantEmail,
        adress,
        products 
    } = req.body;

    // Build the clean data object exactly as the model expects it
    const cleanRestaurantData = { 
        restaurantName, 
        restaurantDescription,
        restaurantCategory, 
        restaurantAuthorizedUsers,
        restaurantPhone,
        restaurantEmail,
        adress,
        products 
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
    const restaurantId = req.params.id;
    
    // Create a new, clean object translated for the database schema
    const dbUpdates = {};

    //  Translate api keys from req.body to Database keys.
    // We check against undefined so that empty strings or boolean false are still applied.
    if (req.body.restaurantName !== undefined) {
        dbUpdates.name = req.body.restaurantName;
    }
    if (req.body.restaurantDescription !== undefined) {
        dbUpdates.description = req.body.restaurantDescription;
    }
    if (req.body.restaurantCategory !== undefined) {
        dbUpdates.category = req.body.restaurantCategory;
    }
    if (req.body.restaurantAuthorizedUsers !== undefined) {
        dbUpdates.authorizedUsers = req.body.restaurantAuthorizedUsers;
    }
    if (req.body.restaurantPhone !== undefined) {
        dbUpdates.phone = req.body.restaurantPhone;
    }
    if (req.body.restaurantEmail !== undefined) {
        dbUpdates.email = req.body.restaurantEmail;
    }
    if (req.body.adress !== undefined) {
        dbUpdates.adress = req.body.adress;
    }
    if (req.body.products !== undefined) {
        dbUpdates.products = req.body.products;
    }

    // Check if the object is entirely empty (the user sent nothing valid to update)
    if (Object.keys(dbUpdates).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Pass the cleanly mapped object to the model
    const updatedRestaurant = restaurantsModel.updateRestaurant(restaurantId, dbUpdates);

    // Handle Not Found
    if (!updatedRestaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Return success with the updated object
    res.status(200).json(updatedRestaurant);
};

//Deletes an restaurant by ID, Returns 404 if not found
const deleteRestaurant = (req,res) => {
    const restaurantId = req.params.id;
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