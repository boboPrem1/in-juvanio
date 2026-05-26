// src/hooks/useParallax.js
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

/**
 * Applique un effet parallaxe vertical à un élément en fonction du scroll de la page.
 *
 * @param {number} factor   — multiplicateur du scroll (ex: 0.15 = 15% de vitesse)
 *                            positif = défile vers le bas, négatif = défile vers le haut
 * @param {object} options
 * @param {boolean} options.clampToViewport — limite le déplacement à la hauteur de la fenêtre
 *
 * @returns {{ ref }}  — à attacher à l'élément à animer
 */
export function useParallax(factor = 0.15, { clampToViewport = false } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || factor === 0) return;

    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      let offset = window.scrollY * factor;

      if (clampToViewport) {
        const limit = window.innerHeight;
        offset = Math.max(-limit, Math.min(limit, offset));
      }

      // Utiliser transform pour ne pas déclencher de reflow
      el.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Position initiale

    return () => window.removeEventListener('scroll', handleScroll);
  }, [factor, clampToViewport]);

  return { ref };
}
