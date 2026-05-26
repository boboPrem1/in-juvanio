// src/components/preview/PreviewFrame.jsx
import { useRef, useEffect } from 'react';
import { useParams }          from 'react-router-dom';
import { useIframeBridge }    from '../../hooks/useIframeBridge';
import { useSkinStore }       from '../../store/useSkinStore';

const ENGINE_ORIGIN = import.meta.env.VITE_ENGINE_ORIGIN ?? 'http://localhost:5174';

export default function PreviewFrame({ width }) {
  const { slug }     = useParams();
  const iframeRef    = useRef(null);
  const { skin }     = useSkinStore();
  const { postFullSkin } = useIframeBridge(iframeRef);

  // Envoyer le skin complet dès que l'iframe est chargée
  const handleLoad = () => {
    if (skin) postFullSkin(skin);
  };

  const frameStyle = {
    width:  typeof width === 'number' ? `${width}px` : width,
    height: '100%',
    border: 'none',
    transition: 'width 0.3s ease',
    margin: typeof width === 'number' ? '0 auto' : undefined,
    display: 'block',
  };

  const src = `${ENGINE_ORIGIN}/?slug=${slug}&preview=true`;

  return (
    <iframe
      id="previewFrame"
      ref={iframeRef}
      src={src}
      style={frameStyle}
      title="Portfolio preview"
      onLoad={handleLoad}
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  );
}
