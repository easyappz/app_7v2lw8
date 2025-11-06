import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="border-b border-ink-100 bg-white sticky top-0 z-40" data-easytag="id1-react/src/components/Header.js">
      <div className="container-app h-16 flex items-center justify-between" data-easytag="id2-react/src/components/Header.js">
        <Link to="/" className="flex items-center gap-2" data-easytag="id3-react/src/components/Header.js">
          <div className="h-7 w-7 rounded-lg bg-ink-900" data-easytag="id4-react/src/components/Header.js"></div>
          <span className="font-semibold tracking-tight" data-easytag="id5-react/src/components/Header.js">Easyappz Board</span>
        </Link>
        <nav className="flex items-center gap-3" data-easytag="id6-react/src/components/Header.js">
          {isAdmin && (
            <Link to="/admin" className={`px-3 py-2 rounded-lg hover:bg-ink-50 ${location.pathname.startsWith('/admin') ? 'text-brand-blue' : 'text-ink-700'}`} data-easytag="id7-react/src/components/Header.js">Админ</Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard" className={`px-3 py-2 rounded-lg hover:bg-ink-50 ${location.pathname.startsWith('/dashboard') ? 'text-brand-blue' : 'text-ink-700'}`} data-easytag="id8-react/src/components/Header.js">Мои объявления</Link>
              <button onClick={logout} className="btn btn-ghost" data-easytag="id9-react/src/components/Header.js">Выйти</button>
              <button onClick={() => navigate('/ad/new')} className="btn btn-primary" data-easytag="id10-react/src/components/Header.js">Создать</button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary" data-easytag="id11-react/src/components/Header.js">Войти</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
