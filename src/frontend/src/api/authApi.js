import { request } from './index.js';

export const login = (username, password) =>
  request('POST', '/tokens', { username, password });

export const register = (userData) =>
  request('POST', '/users', userData);
