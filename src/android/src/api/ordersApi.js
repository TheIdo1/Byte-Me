import { request } from './index';

export const createOrder = (orderData) =>
  request('POST', '/orders', orderData);

export const getMyOrders = () =>
  request('GET', '/orders/my');
