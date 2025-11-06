import React, { useState } from 'react';
import Container from '../components/Container';
import FormField from '../components/FormField';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(username, password);
      } else {
        await register(username, password, email);
      }
    } catch (e) {
      setError('Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10" data-easytag="id1-react/src/pages/Auth.jsx">
      <Container>
        <div className="max-w-md mx-auto card p-6" data-easytag="id2-react/src/pages/Auth.jsx">
          <div className="flex gap-2 mb-6" role="tablist" data-easytag="id3-react/src/pages/Auth.jsx">
            <button className={`btn ${tab==='login' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('login')} data-easytag="id4-react/src/pages/Auth.jsx">Вход</button>
            <button className={`btn ${tab==='register' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('register')} data-easytag="id5-react/src/pages/Auth.jsx">Регистрация</button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" data-easytag="id6-react/src/pages/Auth.jsx" aria-label={tab === 'login' ? 'Форма входа' : 'Форма регистрации'}>
            <FormField label="Логин" required id="username">
              <input id="username" className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Введите логин" data-easytag="id7-react/src/pages/Auth.jsx" />
            </FormField>
            {tab === 'register' && (
              <FormField label="Email" id="email">
                <input id="email" type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ваш email (опционально)" data-easytag="id8-react/src/pages/Auth.jsx" />
              </FormField>
            )}
            <FormField label="Пароль" required id="password">
              <input id="password" type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Введите пароль" data-easytag="id9-react/src/pages/Auth.jsx" />
            </FormField>

            {error && <div className="text-red-600 text-sm" role="alert" data-easytag="id10-react/src/pages/Auth.jsx">{error}</div>}

            <button className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`} disabled={loading} data-easytag="id11-react/src/pages/Auth.jsx">
              {tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
