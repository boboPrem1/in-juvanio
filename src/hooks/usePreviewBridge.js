// src/hooks/usePreviewBridge.js
// Côté moteur React — écoute les postMessage du Skin Studio et applique les patches live.
import { useEffect } from 'react';
import { injectCssVariables } from '../lib/injectCssVariables';

const STUDIO_ORIGIN = import.meta.env.VITE_STUDIO_ORIGIN ?? '*';

/**
 * Utilitaire : fusion profonde non-destructive de deux objets.
 */
function deepMerge(target, source) {
  const result = structuredClone(target ?? {});
  for (const [key, value] of Object.entries(source ?? {})) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = deepMerge(result[key] ?? {}, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Injection ciblée d'une seule CSS var sans re-render (performance).
 * Gère aussi les chemins imbriqués du skin (ex: "theme.dark.--accent").
 */
function injectCssVarPatch(patch) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(patch)) {
    if (typeof key === 'string' && key.startsWith('--')) {
      root.style.setProperty(key, String(value));
    }
  }
}

/**
 * Hook à utiliser dans App.jsx du moteur en mode preview.
 *
 * @param {Function} setSkin   — setter React pour le state skin
 * @param {string}   theme     — thème actif ('dark' | 'light'), pour ré-injecter toutes les vars
 * @returns {boolean}          — true si on est dans le mode preview iframe
 */
export function usePreviewBridge(setSkin, theme) {
  const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';

  useEffect(() => {
    if (!isPreview) return;

    // Signale au Studio que l'iframe est prête
    window.parent?.postMessage(
      { type: 'PREVIEW_READY' },
      STUDIO_ORIGIN
    );

    const handler = (e) => {
      if (STUDIO_ORIGIN !== '*' && e.origin !== STUDIO_ORIGIN) return;

      if (e.data?.type === 'SKIN_PATCH') {
        // Patch partiel : mettre à jour le skin + injecter les CSS vars ciblées
        setSkin((prev) => {
          const merged = deepMerge(prev, e.data.payload);
          injectCssVariables(merged, theme);
          return merged;
        });
        injectCssVarPatch(e.data.payload);
      }

      if (e.data?.type === 'SKIN_FULL') {
        // Skin complet reçu (chargement initial ou rollback)
        setSkin(e.data.payload);
        injectCssVariables(e.data.payload, theme);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [isPreview, theme]);

  return isPreview;
}
