import { request } from './index.js';

export const getRestaurantProducts = (restaurantId) =>
  request('GET', `/restaurants/${restaurantId}/products`);

// --- New Admin Functions ---

/**
 * Creates a new product for a specific restaurant.
 * @param {string} restaurantId - The restaurant UUID.
 * @param {Object} data - The new product data.
 */
export const createProduct = (restaurantId, data) =>
  request('POST', `/restaurants/${restaurantId}/products`, data);

export const updateProduct = (restaurantId, productId, data) =>
  request('PATCH', `/restaurants/${restaurantId}/products/${productId}`, data);

export const deleteProduct = (restaurantId, productId) =>
  request('DELETE', `/restaurants/${restaurantId}/products/${productId}`);
