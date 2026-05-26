// src/hooks/useIframeBridge.js
import { useCallback, useEffect } from 'react';
import { useSkinStore } from '../store/useSkinStore';

const ENGINE_ORIGIN = import.meta.env.VITE_ENGINE_ORIGIN ?? '*';

/**
 * Bridge postMessage entre le Studio et l'iframe preview.
 * @param {React.RefObject} iframeRef — ref attachée à l'iframe
 * @param {Function} onBlockClick    — callback quand un bloc est cliqué dans la preview
 */
export function useIframeBridge(iframeRef, { onBlockClick } = {}) {
  const { skin } = useSkinStore();

  // Envoie un patch ponctuel à l'iframe
  const postPatch = useCallback((patch) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'SKIN_PATCH', payload: patch },
      ENGINE_ORIGIN
    );
  }, [iframeRef]);

  // Envoie le skin complet (ex: après chargement initial ou rollback)
  const postFullSkin = useCallback((fullSkin) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'SKIN_FULL', payload: fullSkin },
      ENGINE_ORIGIN
    );
  }, [iframeRef]);

  // Écoute les événements en provenance de l'iframe
  useEffect(() => {
    const handler = (e) => {
      if (e.origin !== ENGINE_ORIGIN && ENGINE_ORIGIN !== '*') return;

      if (e.data?.type === 'BLOCK_CLICK') {
        onBlockClick?.(e.data.blockId);
      }
      if (e.data?.type === 'PREVIEW_READY' && skin) {
        // L'iframe vient de se charger — lui envoyer le skin complet
        postFullSkin(skin);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [skin, postFullSkin, onBlockClick]);

  return { postPatch, postFullSkin };
}
