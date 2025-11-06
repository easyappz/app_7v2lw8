import instance from './axios';

export async function list(params) {
  const { data } = await instance.get('/api/my/listings/', { params });
  return data;
}

export async function create(formData) {
  const { data } = await instance.post('/api/my/listings/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export async function getOne(id) {
  const { data } = await instance.get(`/api/my/listings/${id}/`);
  return data;
}

export async function update(id, formData) {
  const { data } = await instance.patch(`/api/my/listings/${id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export async function remove(id) {
  await instance.delete(`/api/my/listings/${id}/`);
}
