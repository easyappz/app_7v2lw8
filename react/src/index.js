import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import './api/interceptors';
import { APP_ROUTES } from './routes';

if (typeof window !== 'undefined') {
  try {
    const pages = APP_ROUTES.map(r => r.path);
    if (typeof window.handleRoutes === 'function') {
      window.handleRoutes(pages);
    }
  } catch (e) {
    // swallow
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
