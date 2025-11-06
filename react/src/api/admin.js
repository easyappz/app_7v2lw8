import instance from './axios';

// Listings
export async function adminListings(params) {
  const { data } = await instance.get('/api/admin/listings/', { params });
  return data;
}
export async function adminListingApprove(id) {
  const { data } = await instance.post(`/api/admin/listings/${id}/approve/`, {});
  return data;
}
export async function adminListingReject(id, reason) {
  const { data } = await instance.post(`/api/admin/listings/${id}/reject/`, { reason });
  return data;
}
export async function adminListingToggleActive(id) {
  const { data } = await instance.patch(`/api/admin/listings/${id}/toggle-active/`);
  return data;
}
export async function adminListingDelete(id) {
  await instance.delete(`/api/admin/listings/${id}/`);
}

// Categories
export async function adminCategoriesCreate(payload) {
  const { data } = await instance.post('/api/categories/', payload);
  return data;
}
export async function adminCategoriesUpdate(id, payload) {
  const { data } = await instance.patch(`/api/categories/${id}/`, payload);
  return data;
}
export async function adminCategoriesDelete(id) {
  await instance.delete(`/api/categories/${id}/`);
}

// Users
export async function adminUsers(params) {
  const { data } = await instance.get('/api/admin/users/', { params });
  return data;
}
export async function adminUserToggleActive(id) {
  const { data } = await instance.patch(`/api/admin/users/${id}/toggle-active/`);
  return data;
}
