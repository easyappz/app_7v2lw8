import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdForm from './pages/AdForm';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white" data-easytag="id1-react/src/App.js">
          <Header />
          <main className="flex-1" data-easytag="id2-react/src/App.js">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ad/new"
                element={
                  <ProtectedRoute>
                    <AdForm mode="create" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ad/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdForm mode="edit" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
