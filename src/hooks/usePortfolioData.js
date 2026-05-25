// src/hooks/usePortfolioData.js
// ============================================================
// UNIQUE POINT D'ENTRÉE DES DONNÉES DANS LE MOTEUR REACT
// En dev  : lit apps/engine/dev-seeds/skin.json + data.json (statique, Vite tree-shake en prod)
// En prod : appelle GET /api/v1/portfolio/:slug via React Query
// ============================================================

import { useQuery } from '@tanstack/react-query';

// Seeds statiques — Vite exclut ces imports du bundle de production
// grâce à la dead-code elimination sur import.meta.env.DEV
import skinSeed from '../../apps/engine/dev-seeds/skin.json';
import dataSeed from '../../apps/engine/dev-seeds/data.json';

// ─────────────────────────────────────────
// Normalisation du skin (compatibilité v2 → v3)
// Convertit les anciennes clés nommées de decryptedText
// vers le système générique short/medium/long/xlong
// ─────────────────────────────────────────
function normalizeSkin(rawSkin) {
  if (!rawSkin) return null;

  const skin = structuredClone(rawSkin);

  // Migration decryptedText : si l'ancien format est présent, le normaliser
  const dt = skin.animations?.decryptedText;
  if (dt && !dt.short) {
    const durations = Object.values(dt)
      .filter(v => typeof v === 'number')
      .sort((a, b) => a - b);
    skin.animations.decryptedText = {
      short:  durations[0] ?? 400,
      medium: durations[1] ?? 600,
      long:   durations[2] ?? 900,
      xlong:  durations[3] ?? 1200,
    };
  }

  // Assurer les valeurs par défaut des addons
  skin.addons = {
    customCursor:  false,
    bootSequence:  false,
    noiseOverlay:  true,
    networkCanvas: false,
    ...skin.addons,
  };

  return skin;
}

// ─────────────────────────────────────────
// Fetcher API production
// ─────────────────────────────────────────
async function fetchPortfolio(slug) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
  const res = await fetch(`${BASE_URL}/api/v1/portfolio/${slug}`);

  if (!res.ok) {
    const error = new Error(`Portfolio non trouvé pour le slug: ${slug}`);
    error.status = res.status;
    throw error;
  }

  const payload = await res.json();
  // Réponse API attendue: { skin: {...}, data: {...} }
  return {
    skin: normalizeSkin(payload.skin),
    data: payload.data,
  };
}

// ─────────────────────────────────────────
// Résolution du slug depuis l'hostname
// juvanio.portfolioengine.com → "juvanio"
// localhost:5173              → valeur de VITE_DEV_SLUG
// ─────────────────────────────────────────
export function resolveSlugFromHostname() {
  const hostname = window.location.hostname;

  // Dev local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_DEV_SLUG ?? 'dev';
  }

  // Domaine racine du moteur : landing page
  if (hostname === 'portfolioengine.com' || hostname === 'www.portfolioengine.com') {
    return 'home';
  }

  // Sous-domaine: juvanio.portfolioengine.com → "juvanio"
  const parts = hostname.split('.');
  if (parts.length >= 3) return parts[0];

  // Domaine custom (alice.dev) : l'API résout le slug via DNS lookup
  return hostname;
}

// ─────────────────────────────────────────
// HOOK PRINCIPAL — exporté et utilisé dans App.jsx
// Remplace usePortfolioData() + useSkinData() (v2)
// ─────────────────────────────────────────
export function usePortfolioData(slug) {
  // ── MODE DEV ──────────────────────────────────
  // import.meta.env.DEV est remplacé par `true`/`false` à la compilation (Vite).
  // Cette branche est donc du dead code en production → pas d'appel conditionnel de hook au runtime.
  if (import.meta.env.DEV) {
    return {
      skin: normalizeSkin(skinSeed),
      data: dataSeed,
      status: 'success',
      error: null,
      isLoading: false,
      isFetching: false,
    };
  }

  // ── MODE PRODUCTION ────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const query = useQuery({
    queryKey: ['portfolio', slug],
    queryFn:  () => fetchPortfolio(slug),
    staleTime: 5  * 60 * 1000,   // 5 minutes en cache
    gcTime:    30 * 60 * 1000,   // 30 minutes avant garbage collect
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10_000),
  });

  return {
    skin:       query.data?.skin ?? null,
    data:       query.data?.data ?? null,
    status:     query.status,
    error:      query.error,
    isLoading:  query.isLoading,
    isFetching: query.isFetching,
  };
}
