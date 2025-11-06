import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white" data-easytag="id1-react/src/components/Footer.js">
      <div className="container-app py-8 text-sm text-ink-500" data-easytag="id2-react/src/components/Footer.js">
        © {new Date().getFullYear()} Easyappz. Все права защищены.
      </div>
    </footer>
  );
}
