// src/components/publish/SkinLibraryModal.jsx
import { useState, useEffect } from 'react';
import { useParams }            from 'react-router-dom';
import { useSkinStore }         from '../../store/useSkinStore';
import { getSkinTemplates, cloneSkin } from '../../api/skin.api';
import toast from 'react-hot-toast';

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

function SkinCard({ name, preview, onApply }) {
  return (
    <div className="skin-card">
      {preview && <img src={preview} alt={name} className="skin-card__preview" />}
      {!preview && <div className="skin-card__placeholder">◈</div>}
      <div className="skin-card__footer">
        <span className="skin-card__name">{name}</span>
        <button className="studio-btn studio-btn--primary studio-btn--sm" onClick={onApply}>
          Appliquer
        </button>
      </div>
    </div>
  );
}

export default function SkinLibraryModal({ onClose }) {
  const { slug }          = useParams();
  const { setSkin }       = useSkinStore();
  const [templates, setTemplates] = useState([]);
  const [applying, setApplying]   = useState(null);

  useEffect(() => {
    getSkinTemplates()
      .then(setTemplates)
      .catch(() => toast.error('Impossible de charger les templates'));
  }, []);

  const handleApply = async (templateId) => {
    if (!window.confirm('Appliquer ce skin ? Vos modifications actuelles seront remplacées.')) return;
    setApplying(templateId);
    try {
      const newSkin = await cloneSkin(slug, templateId);
      setSkin(newSkin);
      toast.success('Skin appliqué');
      onClose();
    } catch {
      toast.error("Erreur lors de l'application du skin");
    } finally {
      setApplying(null);
    }
  };

  return (
    <Modal title="Bibliothèque de skins" onClose={onClose}>
      {templates.length === 0 ? (
        <p className="editor-empty">Chargement des templates…</p>
      ) : (
        <div className="skin-grid">
          {templates.map((t) => (
            <SkinCard
              key={t.id}
              name={t.name}
              preview={t.previewUrl}
              onApply={() => handleApply(t.id)}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}
