import { request } from './index';

export const getAllRestaurants = () =>
  request('GET', '/restaurants');

export const getRestaurantById = (id) =>
  request('GET', `/restaurants/${id}`);

export const createRestaurant = (data) =>
  request('POST', '/restaurants', data);

export const updateRestaurant = (id, data) =>
  request('PATCH', `/restaurants/${id}`, data);

export const deleteRestaurant = (id) =>
  request('DELETE', `/restaurants/${id}`);
