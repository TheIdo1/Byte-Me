import { request } from './index';

export const searchQuery = (query) =>
  request('GET', `/search/${encodeURIComponent(query)}`);
