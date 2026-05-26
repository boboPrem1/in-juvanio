// src/hooks/utils/prefersReducedMotion.js
// Point d'entrée unique pour prefers-reduced-motion — utilisé par tous les hooks d'animation.

/**
 * Retourne true si l'utilisateur a activé prefers-reduced-motion.
 * Lecture synchrone (pas de hook) — utilisable dans n'importe quel contexte.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

import { useState, useEffect } from 'react';

/**
 * Hook React qui s'abonne aux changements de prefers-reduced-motion en temps réel.
 * Utile si l'utilisateur change sa préférence système pendant la session.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
