import instance from './axios';
import { BASE_API_URL } from './config';

export async function apiRegister({ username, password, email }) {
  const { data } = await instance.post(`${BASE_API_URL}/auth/register`, { username, password, email });
  return data;
}

export async function apiLogin({ username, password }) {
  const { data } = await instance.post(`${BASE_API_URL}/auth/login`, { username, password });
  return data; // { access, refresh }
}

export async function apiMe() {
  const { data } = await instance.get(`${BASE_API_URL}/auth/me`);
  return data;
}
