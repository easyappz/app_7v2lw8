import instance from './axios';
import { BASE_API_URL } from './config';

export async function adminFetchListings(params) {
  const { data } = await instance.get(`${BASE_API_URL}/admin/listings/`, { params });
  return data;
}

export async function adminApproveListing(id) {
  const { data } = await instance.post(`${BASE_API_URL}/admin/listings/${id}/approve/`);
  return data;
}

export async function adminRejectListing(id, reason) {
  const { data } = await instance.post(`${BASE_API_URL}/admin/listings/${id}/reject/`, { reason });
  return data;
}

export async function adminToggleListingActive(id) {
  const { data } = await instance.patch(`${BASE_API_URL}/admin/listings/${id}/toggle-active/`);
  return data;
}

export async function adminDeleteListing(id) {
  await instance.delete(`${BASE_API_URL}/admin/listings/${id}/`);
}

export async function adminFetchUsers(params) {
  const { data } = await instance.get(`${BASE_API_URL}/admin/users/`, { params });
  return data;
}

export async function adminToggleUserActive(id) {
  const { data } = await instance.patch(`${BASE_API_URL}/admin/users/${id}/toggle-active/`);
  return data;
}
