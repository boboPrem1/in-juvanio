// src/hooks/useStaggerReveal.js
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

/**
 * Observe un conteneur et ajoute la classe `visible` à chaque enfant
 * correspondant au sélecteur, avec un délai échelonné.
 *
 * @param {string} selector      — sélecteur CSS des enfants à animer (ex: '.git-commit')
 * @param {number} staggerDelay  — délai entre chaque enfant en ms (défaut: 80)
 * @param {number} threshold     — fraction visible du conteneur pour déclencher (défaut: 0.15)
 *
 * @returns {{ containerRef }}   — à attacher au conteneur parent
 */
export function useStaggerReveal(selector, { staggerDelay = 80, threshold = 0.15 } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (prefersReducedMotion()) {
      container.querySelectorAll(selector).forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          container.querySelectorAll(selector).forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * staggerDelay);
          });
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [selector, staggerDelay, threshold]);

  return { containerRef };
}
