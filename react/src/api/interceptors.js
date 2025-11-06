import instance from './axios';

let isRefreshing = false;
let pendingQueue = [];

function subscribeTokenRefresh(cb) {
  pendingQueue.push(cb);
}

function onRefreshed(newToken) {
  pendingQueue.forEach(cb => cb(newToken));
  pendingQueue = [];
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;

    const shouldSkip = original.headers && original.headers['X-Skip-Auth-Refresh'] === '1';
    if (status === 401 && !shouldSkip) {
      if (original._retry) {
        // avoid infinite loop
        return Promise.reject(error);
      }
      original._retry = true;

      const refresh = localStorage.getItem('refresh');
      if (!refresh) {
        // no refresh -> logout path
        localStorage.removeItem('token');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            original.headers = original.headers || {};
            original.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(instance(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshResp = await instance.post('/api/auth/refresh', { refresh }, { headers: { 'X-Skip-Auth-Refresh': '1' } });
        const newAccess = refreshResp.data?.access;
        if (newAccess) {
          localStorage.setItem('token', newAccess);
          onRefreshed(newAccess);
          original.headers = original.headers || {};
          original.headers['Authorization'] = `Bearer ${newAccess}`;
          return instance(original);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        onRefreshed('');
        return Promise.reject(error);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        onRefreshed('');
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
