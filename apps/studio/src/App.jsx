// apps/studio/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard    from './components/auth/AuthGuard';
import LoginPage    from './components/auth/LoginPage';
import StudioLayout from './components/layout/StudioLayout';

export default function App() {
  return (
    <Routes>
      {/* Redirection racine → page de login avec slug par défaut */}
      <Route path="/" element={<Navigate to="/studio/dev/login" replace />} />

      {/* Connexion */}
      <Route path="/studio/:slug/login" element={<LoginPage />} />

      {/* Studio protégé — toutes les sous-routes */}
      <Route
        path="/studio/:slug/*"
        element={
          <AuthGuard>
            <StudioLayout />
          </AuthGuard>
        }
      />
    </Routes>
  );
}
