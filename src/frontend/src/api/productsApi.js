import { request } from './index.js';

export const getRestaurantProducts = (restaurantId) =>
  request('GET', `/restaurants/${restaurantId}/products`);


export const createProduct = (restaurantId, data) =>
  request('POST', `/restaurants/${restaurantId}/products`, data);

export const updateProduct = (restaurantId, productId, data) =>
  request('PATCH', `/restaurants/${restaurantId}/products/${productId}`, data);

export const deleteProduct = (restaurantId, productId) =>
  request('DELETE', `/restaurants/${restaurantId}/products/${productId}`);
