import { request } from './index.js';

export const searchQuery = (query) =>
  request('GET', `/search/${encodeURIComponent(query)}`);
