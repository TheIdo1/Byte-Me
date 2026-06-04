import { request } from './index.js';

export const getAllRestaurants = () =>
  request('GET', '/restaurants');

export const getRestaurantById = (id) =>
  request('GET', `/restaurants/${id}`);

export const createRestaurant = (data) =>
  request('POST', '/restaurants', data);
