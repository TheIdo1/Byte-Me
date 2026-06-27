const restaurantsService = require('../services/restaurants.service');

// Returns all restaurants
const getAllRestaurants = async (_req, res) => {
    try {
        const restaurants = await restaurantsService.getAllRestaurants();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Returns a single restaurant by ID. Returns 404 if not found.
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await restaurantsService.getRestaurantById(req.params.rId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createRestaurant = async (req, res) => {
    try {
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

        const newRestaurant = await restaurantsService.createRestaurant(cleanRestaurantData);
        res.status(201).location(`/api/restaurants/${newRestaurant.id}`).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/*
 Updates an existing restaurant.
 Assumes that the validation middleware has already sanitized req.body.
*/
const updateRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.rId;
        const dbUpdates = req.body;

        if (Object.keys(dbUpdates).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update' });
        }

        const updatedRestaurant = await restaurantsService.updateRestaurant(restaurantId, dbUpdates);

        if (!updatedRestaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Deletes a restaurant by ID. Returns 404 if not found.
const deleteRestaurant = async (req, res) => {
    try {
        const isDeleted = await restaurantsService.deleteRestaurant(req.params.rId);
        if (!isDeleted) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
