import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = location.state?.from?.pathname || '/';

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ username: form.username, password: form.password });
        toast.push({ type: 'success', title: 'Успешный вход' });
      } else {
        await register({ username: form.username, password: form.password, email: form.email });
        toast.push({ type: 'success', title: 'Регистрация успешна' });
      }
      navigate(from);
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Ошибка авторизации';
      setError(msg);
      toast.push({ type: 'error', title: 'Ошибка', message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app py-10" data-easytag="id1-react/src/pages/Auth.js">
      <div className="max-w-md mx-auto card p-6" data-easytag="id2-react/src/pages/Auth.js">
        <div className="flex gap-2 mb-6" data-easytag="id3-react/src/pages/Auth.js">
          <button className={`flex-1 px-4 py-2 rounded-lg border ${mode === 'login' ? 'border-ink-900' : 'border-ink-200'}`} onClick={() => setMode('login')} data-easytag="id4-react/src/pages/Auth.js">Вход</button>
          <button className={`flex-1 px-4 py-2 rounded-lg border ${mode === 'register' ? 'border-ink-900' : 'border-ink-200'}`} onClick={() => setMode('register')} data-easytag="id5-react/src/pages/Auth.js">Регистрация</button>
        </div>
        <form onSubmit={submit} className="space-y-4" data-easytag="id6-react/src/pages/Auth.js">
          <div data-easytag="id7-react/src/pages/Auth.js">
            <label className="block text-sm mb-1" data-easytag="id8-react/src/pages/Auth.js">Имя пользователя</label>
            <input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required data-easytag="id9-react/src/pages/Auth.js" />
          </div>
          {mode === 'register' && (
            <div data-easytag="id10-react/src/pages/Auth.js">
              <label className="block text-sm mb-1" data-easytag="id11-react/src/pages/Auth.js">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-easytag="id12-react/src/pages/Auth.js" />
            </div>
          )}
          <div data-easytag="id13-react/src/pages/Auth.js">
            <label className="block text-sm mb-1" data-easytag="id14-react/src/pages/Auth.js">Пароль</label>
            <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required data-easytag="id15-react/src/pages/Auth.js" />
          </div>
          {error && <div className="text-sm text-red-600" data-easytag="id16-react/src/pages/Auth.js">{error}</div>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading} data-easytag="id17-react/src/pages/Auth.js">{loading ? 'Подождите...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}</button>
        </form>
      </div>
    </div>
  );
}
