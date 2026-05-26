// src/components/publish/PublishButton.jsx
import { useState }       from 'react';
import { useParams }      from 'react-router-dom';
import { useSkinStore }   from '../../store/useSkinStore';
import { publishSkin }    from '../../api/publish.api';
import toast              from 'react-hot-toast';

export default function PublishButton() {
  const { slug }              = useParams();
  const { isDirty, markSaved } = useSkinStore();
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!window.confirm('Publier cette version ? Un snapshot de rollback sera créé.')) return;
    setPublishing(true);
    try {
      const result = await publishSkin(slug);
      markSaved();
      toast.success(
        `Publié le ${new Date(result.publishedAt).toLocaleString('fr-FR')}`,
        { duration: 4000 }
      );
    } catch {
      toast.error('Erreur lors de la publication');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <button
      className={`publish-btn ${isDirty ? 'has-changes' : ''}`}
      onClick={handlePublish}
      disabled={publishing}
    >
      <span>{publishing ? '⏳ Publication…' : '🚀 Publier'}</span>
      {isDirty && (
        <span className="dirty-indicator" title="Modifications non publiées" />
      )}
    </button>
  );
}
