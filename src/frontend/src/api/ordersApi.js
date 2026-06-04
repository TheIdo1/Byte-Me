import { request } from './index.js';

export const createOrder = (orderData) =>
  request('POST', '/orders', orderData);
