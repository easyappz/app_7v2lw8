import instance from './axios';
import { BASE_API_URL } from './config';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh');
      if (!refreshToken) {
        localStorage.removeItem('token');
        window.location.replace('/auth');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return instance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;
      try {
        const res = await instance.post(`${BASE_API_URL}/auth/refresh`, { refresh: refreshToken });
        const newAccess = res.data?.access;
        if (newAccess) {
          localStorage.setItem('token', newAccess);
          processQueue(null, newAccess);
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;
          return instance(originalRequest);
        }
      } catch (e) {
        processQueue(e, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.replace('/auth');
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
