import { request } from './index.js';

export const getRestaurantProducts = (restaurantId) =>
  request('GET', `/restaurants/${restaurantId}/products`);
