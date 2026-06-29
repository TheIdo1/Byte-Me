import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

async function authHeaders() {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: token } : {};
}

export async function request(method, path, body) {
  const headers = await authHeaders();
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  if (body !== undefined) options.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}
