// src/components/publish/HistoryPanel.jsx
import { useState, useEffect } from 'react';
import { useParams }            from 'react-router-dom';
import { useSkinStore }         from '../../store/useSkinStore';
import { getSkinHistory, rollbackSkin } from '../../api/skin.api';
import toast                    from 'react-hot-toast';

export default function HistoryPanel() {
  const { slug }        = useParams();
  const { setSkin }     = useSkinStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkinHistory(slug)
      .then(setHistory)
      .catch(() => toast.error("Impossible de charger l'historique"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleRollback = async (historyId) => {
    if (!window.confirm('Restaurer cette version ? Le skin actuel sera remplacé.')) return;
    try {
      const { skin } = await rollbackSkin(slug, historyId);
      setSkin(skin);
      toast.success('Version restaurée et re-publiée');
      // Recharge l'historique
      getSkinHistory(slug).then(setHistory);
    } catch {
      toast.error('Erreur lors de la restauration');
    }
  };

  return (
    <div className="history-panel">
      <h3 className="history-panel__title">Historique des publications</h3>
      {loading && <p className="editor-empty">Chargement…</p>}
      {!loading && history.length === 0 && (
        <p className="editor-empty">Aucune publication pour ce portfolio.</p>
      )}
      <ul className="history-panel__list">
        {history.map((h) => (
          <li key={h.id} className="history-panel__item">
            <span className="history-panel__date">
              {new Date(h.created_at).toLocaleString('fr-FR', {
                day:    '2-digit',
                month:  '2-digit',
                year:   'numeric',
                hour:   '2-digit',
                minute: '2-digit',
              })}
            </span>
            <button
              className="studio-btn studio-btn--ghost studio-btn--sm"
              onClick={() => handleRollback(h.id)}
            >
              ↩ Restaurer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
