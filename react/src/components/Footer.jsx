import React from 'react';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white" data-easytag="id1-react/src/components/Footer.jsx">
      <Container className="py-8 text-sm text-ink-500 flex items-center justify-between" >
        <p data-easytag="id2-react/src/components/Footer.jsx">© {new Date().getFullYear()} Easyappz. Все права защищены.</p>
        <div className="flex gap-4" data-easytag="id3-react/src/components/Footer.jsx">
          <a href="#" className="hover:text-black" data-easytag="id4-react/src/components/Footer.jsx" aria-label="Пользовательское соглашение">Условия</a>
          <a href="#" className="hover:text-black" data-easytag="id5-react/src/components/Footer.jsx" aria-label="Политика конфиденциальности">Конфиденциальность</a>
        </div>
      </Container>
    </footer>
  );
}
