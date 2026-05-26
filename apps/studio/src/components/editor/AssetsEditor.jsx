// src/components/editor/AssetsEditor.jsx
import { useState }             from 'react';
import { useParams }            from 'react-router-dom';
import { useSkinStore }         from '../../store/useSkinStore';
import { getPresignedUrl, uploadToS3 } from '../../api/assets.api';
import toast                    from 'react-hot-toast';

const MAX_SIZE = {
  heroPhoto: 2 * 1024 * 1024,
  favicon:   1 * 1024 * 1024,
  cvPdf:     5 * 1024 * 1024,
};

const ASSET_CONFIGS = [
  { key: 'heroPhoto', label: 'Photo de profil', accept: 'image/jpeg,image/png,image/webp' },
  { key: 'favicon',   label: 'Favicon',          accept: 'image/x-icon,image/png,image/svg+xml' },
  { key: 'cvPdf',     label: 'CV (PDF)',          accept: 'application/pdf' },
];

function AssetUploader({ label, assetKey, accept, currentUrl, loading, onUpload }) {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="asset-uploader">
      <div className="asset-uploader__header">
        <span className="asset-uploader__label">{label}</span>
        {currentUrl && (
          <a href={currentUrl} target="_blank" rel="noreferrer" className="asset-uploader__link">
            ↗ Voir
          </a>
        )}
      </div>
      {currentUrl && assetKey === 'heroPhoto' && (
        <img src={currentUrl} alt="Preview" className="asset-uploader__preview" />
      )}
      <label className={`asset-uploader__btn ${loading ? 'loading' : ''}`}>
        {loading ? '⏳ Upload en cours…' : '📁 Choisir un fichier'}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={loading}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
}

export default function AssetsEditor() {
  const { slug }              = useParams();
  const { skin, updateToken } = useSkinStore();
  const [uploading, setUploading] = useState({});

  const handleUpload = async (assetKey, file) => {
    const maxSize = MAX_SIZE[assetKey] ?? 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Fichier trop volumineux (max ${Math.round(maxSize / 1024 / 1024)} Mo)`);
      return;
    }

    setUploading((prev) => ({ ...prev, [assetKey]: true }));
    try {
      const { uploadUrl, cdnUrl } = await getPresignedUrl(slug, {
        filename:    file.name,
        contentType: file.type,
        assetKey,
      });
      await uploadToS3(uploadUrl, file);
      updateToken(`assets.${assetKey}`, cdnUrl);
      toast.success('Asset uploadé avec succès');
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading((prev) => ({ ...prev, [assetKey]: false }));
    }
  };

  return (
    <div className="assets-editor">
      {ASSET_CONFIGS.map(({ key, label, accept }) => (
        <AssetUploader
          key={key}
          label={label}
          assetKey={key}
          accept={accept}
          currentUrl={skin?.assets?.[key]}
          loading={!!uploading[key]}
          onUpload={(file) => handleUpload(key, file)}
        />
      ))}
    </div>
  );
}
