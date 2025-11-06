import instance from './axios';
import { BASE_API_URL } from './config';

export async function fetchCategories() {
  const { data } = await instance.get(`${BASE_API_URL}/categories/`);
  return data;
}

export async function adminCreateCategory(payload) {
  const { data } = await instance.post(`${BASE_API_URL}/categories/`, payload);
  return data;
}

export async function adminUpdateCategory(id, payload) {
  const { data } = await instance.patch(`${BASE_API_URL}/categories/${id}/`, payload);
  return data;
}

export async function adminDeleteCategory(id) {
  await instance.delete(`${BASE_API_URL}/categories/${id}/`);
}
