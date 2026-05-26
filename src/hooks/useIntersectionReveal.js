// src/hooks/useIntersectionReveal.js
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

/**
 * Observe un élément et signale son entrée dans le viewport.
 *
 * @param {object} options
 * @param {number}  options.threshold     — fraction visible pour déclencher (défaut: 0.15)
 * @param {string}  options.rootMargin    — marge CSS autour du viewport (défaut: '0px')
 * @param {boolean} options.once          — arrêter d'observer après la première entrée (défaut: true)
 *
 * @returns {{ ref, isVisible }}
 *   ref       — à attacher à l'élément DOM observé
 *   isVisible — true quand l'élément est dans le viewport
 */
export function useIntersectionReveal({
  threshold  = 0.15,
  rootMargin = '0px',
  once       = true,
} = {}) {
  const ref = useRef(null);
  // Si reduced motion : considère tout comme "visible" immédiatement
  const [isVisible, setIsVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
