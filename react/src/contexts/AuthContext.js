import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as apiAuth from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const tokens = {
    get access() { return localStorage.getItem('token') || ''; },
    set access(v) { if (v) localStorage.setItem('token', v); else localStorage.removeItem('token'); },
    get refresh() { return localStorage.getItem('refresh') || ''; },
    set refresh(v) { if (v) localStorage.setItem('refresh', v); else localStorage.removeItem('refresh'); },
    clear() { localStorage.removeItem('token'); localStorage.removeItem('refresh'); }
  };

  const loadMe = async () => {
    try {
      if (!tokens.access && !tokens.refresh) {
        setUser(null);
        return;
      }
      const me = await apiAuth.me();
      setUser(me);
    } catch (_e) {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadMe();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    const res = await apiAuth.login({ username, password });
    tokens.access = res.access;
    tokens.refresh = res.refresh;
    await loadMe();
    navigate(location.state?.from || '/', { replace: true });
  };

  const register = async (username, password, email) => {
    await apiAuth.register({ username, password, email });
    // After register, auto login
    const res = await apiAuth.login({ username, password });
    tokens.access = res.access;
    tokens.refresh = res.refresh;
    await loadMe();
    navigate('/', { replace: true });
  };

  const logout = () => {
    tokens.clear();
    setUser(null);
    navigate('/auth');
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.is_staff,
    loading,
    login,
    register,
    logout,
    refreshToken: tokens.refresh,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
