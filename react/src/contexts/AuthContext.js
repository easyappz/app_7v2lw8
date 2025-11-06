import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiLogin, apiMe, apiRegister } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const me = await apiMe();
        setUser(me);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login({ username, password }) {
    const tokens = await apiLogin({ username, password });
    localStorage.setItem('token', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
    const me = await apiMe();
    setUser(me);
    return me;
  }

  async function register({ username, password, email }) {
    await apiRegister({ username, password, email });
    return login({ username, password });
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setUser(null);
    window.location.replace('/auth');
  }

  const value = useMemo(() => ({ user, setUser, login, register, logout, loading, isAdmin: !!user?.is_staff, isAuthenticated: !!user }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
