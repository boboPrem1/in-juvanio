// src/components/auth/AuthGuard.jsx
import { useEffect }       from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuthStore }    from '../../store/useAuthStore';

function FullScreenLoader() {
  return (
    <div className="studio-loader">
      <div className="studio-loader__spinner" />
      <span>Chargement…</span>
    </div>
  );
}

export default function AuthGuard({ children }) {
  const { accessToken, isLoading } = useAuthStore();
  const { slug } = useParams();

  // Écoute l'événement logout global (déclenché depuis useAuthStore)
  useEffect(() => {
    const handler = () => {
      window.location.href = `/studio/${slug}/login`;
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [slug]);

  if (isLoading) return <FullScreenLoader />;
  if (!accessToken) return <Navigate to={`/studio/${slug}/login`} replace />;
  return children;
}
