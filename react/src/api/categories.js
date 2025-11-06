import instance from './axios';

export async function list() {
  const { data } = await instance.get('/api/categories/');
  return data;
}
