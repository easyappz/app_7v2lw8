import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Container from './Container';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="border-b border-ink-100 bg-white sticky top-0 z-40" data-easytag="id1-react/src/components/Header.jsx">
      <Container className="flex items-center justify-between h-16">
        <div className="flex items-center gap-3" data-easytag="id2-react/src/components/Header.jsx">
          <Link to="/" className="flex items-center gap-2" data-easytag="id3-react/src/components/Header.jsx" aria-label="На главную">
            <div className="w-6 h-6 rounded-md bg-black" data-easytag="id4-react/src/components/Header.jsx" aria-hidden="true"></div>
            <span className="font-semibold tracking-tight" data-easytag="id5-react/src/components/Header.jsx">Easyappz Маркет</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6" data-easytag="id6-react/src/components/Header.jsx" aria-label="Главное меню">
          <NavLink to="/" className={({isActive}) => `text-sm ${isActive ? 'text-black' : 'text-ink-500 hover:text-black'}`} data-easytag="id7-react/src/components/Header.jsx">Главная</NavLink>
        </nav>
        <div className="flex items-center gap-3" data-easytag="id8-react/src/components/Header.jsx">
          {!isAuthenticated && (
            <div className="flex items-center gap-2" data-easytag="id9-react/src/components/Header.jsx">
              <Link to="/auth" className="btn btn-ghost" data-easytag="id10-react/src/components/Header.jsx">Войти</Link>
              <Link to="/auth" className="btn btn-primary" data-easytag="id11-react/src/components/Header.jsx">Регистрация</Link>
            </div>
          )}
          {isAuthenticated && (
            <div className="flex items-center gap-2" data-easytag="id12-react/src/components/Header.jsx">
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline" data-easytag="id13-react/src/components/Header.jsx">Админ</Link>
              )}
              <Link to="/dashboard" className="btn btn-outline" data-easytag="id14-react/src/components/Header.jsx">{user?.username}</Link>
              <button className="btn btn-ghost" onClick={logout} data-easytag="id15-react/src/components/Header.jsx">Выйти</button>
              <Link to="/ad/new" className="btn btn-primary" data-easytag="id16-react/src/components/Header.jsx">+ Разместить</Link>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
