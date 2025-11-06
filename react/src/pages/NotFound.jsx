import React from 'react';
import Container from '../components/Container';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="py-20" data-easytag="id1-react/src/pages/NotFound.jsx">
      <Container>
        <div className="text-center space-y-4" data-easytag="id2-react/src/pages/NotFound.jsx">
          <h1 className="h1" data-easytag="id3-react/src/pages/NotFound.jsx">Страница не найдена</h1>
          <p className="muted" data-easytag="id4-react/src/pages/NotFound.jsx">Ошибка 404</p>
          <Link to="/" className="btn btn-primary" data-easytag="id5-react/src/pages/NotFound.jsx">На главную</Link>
        </div>
      </Container>
    </section>
  );
}
