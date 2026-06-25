const restaurantsModel = require('../models/restaurants.model');

// Returns all restaurants
const getAllRestaurants = async (_req, res) => {
    const restaurants = await restaurantsModel.getAllRestaurants();
    res.json(restaurants);
};

// Returns a single restaurant by ID. Returns 404 if not found.
const getRestaurantById = async (req, res) => {
    const restaurantId = req.params.rId;
    const restaurant = await restaurantsModel.getRestaurantById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
};

const createRestaurant = async (req, res) => {
    // validateCreateRestaurant middleware has already guaranteed that fields: name, category, address, phone, email
    // are present and have the correct types.
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

    const newRestaurant = await restaurantsModel.createRestaurant(cleanRestaurantData);

    res.status(201).location(`/api/restaurants/${newRestaurant.id}`).json(newRestaurant);
};

/*
 Updates an existing restaurant.
 Assumes that the validation middleware has already sanitized req.body.
*/
const updateRestaurant = async (req, res) => {
    const restaurantId = req.params.rId;

    const dbUpdates = req.body;

    if (Object.keys(dbUpdates).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const updatedRestaurant = await restaurantsModel.updateRestaurant(restaurantId, dbUpdates);

    if (!updatedRestaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.status(204).send();
};

// Deletes a restaurant by ID. Returns 404 if not found.
const deleteRestaurant = async (req, res) => {
    const restaurantId = req.params.rId;
    const isDeleted = await restaurantsModel.deleteRestaurant(restaurantId);
    if (!isDeleted) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.status(204).send();
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
