import instance from './axios';

export async function login(payload) {
  const { data } = await instance.post('/api/auth/login', payload);
  return data;
}

export async function register(payload) {
  const { data } = await instance.post('/api/auth/register', payload);
  return data;
}

export async function me() {
  const { data } = await instance.get('/api/auth/me');
  return data;
}
