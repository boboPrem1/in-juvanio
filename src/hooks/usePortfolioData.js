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
// Normalisation du skin (compatibilité v2/v3 → v4)
// ─────────────────────────────────────────
function normalizeSkin(rawSkin) {
  if (!rawSkin) return null;

  const skin = structuredClone(rawSkin);

  if (!skin.animations) skin.animations = {};
  const anim = skin.animations;

  // Migration v2/v3 decryptedText → v4 durations
  if (anim.decryptedText && !anim.durations) {
    const dt = anim.decryptedText;
    if (dt.short !== undefined) {
      anim.durations = {
        short:  dt.short  ?? 400,
        medium: dt.medium ?? 800,
        long:   dt.long   ?? 1200,
        xlong:  dt.xlong  ?? 1800,
      };
    } else {
      const vals = Object.values(dt).filter(v => typeof v === 'number').sort((a, b) => a - b);
      anim.durations = {
        short:  vals[0] ?? 400,
        medium: vals[1] ?? 800,
        long:   vals[2] ?? 1200,
        xlong:  vals[3] ?? 1800,
      };
    }
    delete anim.decryptedText;
  }

  // Migration v2/v3 parallaxFactor → v4 parallax
  if (anim.parallaxFactor !== undefined && !anim.parallax) {
    anim.parallax = {
      heroGrid:  anim.parallaxFactor,
      heroPhoto: parseFloat((anim.parallaxFactor * 0.5).toFixed(3)),
    };
    delete anim.parallaxFactor;
  }

  // Migration old stagger keys → semantic keys
  if (anim.stagger) {
    if (anim.stagger.experienceDelay !== undefined && anim.stagger.default === undefined) {
      anim.stagger.default = anim.stagger.experienceDelay;
      delete anim.stagger.experienceDelay;
    }
    if (anim.stagger.skillsDelay !== undefined && anim.stagger.loose === undefined) {
      anim.stagger.loose = anim.stagger.skillsDelay;
      delete anim.stagger.skillsDelay;
    }
  }

  // Addons defaults
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
