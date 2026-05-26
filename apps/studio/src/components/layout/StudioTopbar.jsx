// src/components/layout/StudioTopbar.jsx
import { useNavigate }         from 'react-router-dom';
import { useSkinStore, useTemporalSkinStore } from '../../store/useSkinStore';
import { useAuthStore }        from '../../store/useAuthStore';
import { useAutoSave }         from '../../hooks/useAutoSave';
import toast                   from 'react-hot-toast';

export default function StudioTopbar({ slug }) {
  const navigate = useNavigate();
  const { isDirty, lastSavedAt } = useSkinStore();
  const { undo, redo, pastStates, futureStates } = useTemporalSkinStore();
  const { logout } = useAuthStore();

  useAutoSave(() => toast.success('Modifications sauvegardées', { duration: 1500 }));

  const handleLogout = () => {
    logout();
    navigate(`/studio/${slug}/login`);
  };

  const savedLabel = lastSavedAt
    ? `Sauvegardé ${new Date(lastSavedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    : 'Prêt';

  return (
    <header className="studio-topbar">
      <div className="studio-topbar__left">
        <span className="studio-topbar__logo">◈ Skin Studio</span>
        <span className="studio-topbar__slug">/{slug}</span>
      </div>

      <div className="studio-topbar__center">
        <button
          className="studio-btn studio-btn--icon"
          onClick={() => undo()}
          disabled={pastStates.length === 0}
          title="Annuler (Ctrl+Z)"
        >
          ↩
        </button>
        <button
          className="studio-btn studio-btn--icon"
          onClick={() => redo()}
          disabled={futureStates.length === 0}
          title="Rétablir (Ctrl+Y)"
        >
          ↪
        </button>
        <span className={`studio-topbar__status ${isDirty ? 'dirty' : 'saved'}`}>
          {isDirty ? '● Modifications non publiées' : savedLabel}
        </span>
      </div>

      <div className="studio-topbar__right">
        <a
          href={`${import.meta.env.VITE_ENGINE_ORIGIN}/?slug=${slug}`}
          target="_blank"
          rel="noreferrer"
          className="studio-btn studio-btn--ghost"
        >
          ↗ Voir le portfolio
        </a>
        <button className="studio-btn studio-btn--ghost" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}
