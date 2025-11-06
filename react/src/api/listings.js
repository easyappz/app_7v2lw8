import instance from './axios';
import { BASE_API_URL } from './config';

export async function fetchPublicListings(params) {
  const { data } = await instance.get(`${BASE_API_URL}/listings/`, { params });
  return data; // PaginatedListings
}

export async function fetchPublicListing(id) {
  const { data } = await instance.get(`${BASE_API_URL}/listings/${id}/`);
  return data;
}

export async function fetchMyListings(params) {
  const { data } = await instance.get(`${BASE_API_URL}/my/listings/`, { params });
  return data;
}

export async function createMyListing(formData) {
  const { data } = await instance.post(`${BASE_API_URL}/my/listings/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function retrieveMyListing(id) {
  const { data } = await instance.get(`${BASE_API_URL}/my/listings/${id}/`);
  return data;
}

export async function updateMyListing(id, formData) {
  const { data } = await instance.patch(`${BASE_API_URL}/my/listings/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteMyListing(id) {
  await instance.delete(`${BASE_API_URL}/my/listings/${id}/`);
}
