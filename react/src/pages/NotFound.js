import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-app py-16 text-center" data-easytag="id1-react/src/pages/NotFound.js">
      <div className="h1 mb-3" data-easytag="id2-react/src/pages/NotFound.js">404</div>
      <p className="text-ink-600" data-easytag="id3-react/src/pages/NotFound.js">Страница не найдена</p>
      <Link to="/" className="btn btn-primary mt-6 inline-block" data-easytag="id4-react/src/pages/NotFound.js">На главную</Link>
    </div>
  );
}
