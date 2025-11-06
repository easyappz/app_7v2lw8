import instance from './axios';

export async function publicList(params) {
  const { data } = await instance.get('/api/listings/', { params });
  return data;
}

export async function getOne(id) {
  const { data } = await instance.get(`/api/listings/${id}/`);
  return data;
}
