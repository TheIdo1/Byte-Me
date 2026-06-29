import { request } from './index';

export const login = (username, password) =>
  request('POST', '/tokens', { username, password });

export const register = (userData) =>
  request('POST', '/users', userData);

export const getUserById = (id) =>
  request('GET', `/users/${id}`);
