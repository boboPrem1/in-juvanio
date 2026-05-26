// src/hooks/useDecryptText.js
import { useState, useEffect, useRef } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

const CHARS = '!<>-_\\/[]{}—=+*^?#_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * @param {string}  text      — texte cible final
 * @param {number}  duration  — durée totale de l'animation en ms (défaut: 800)
 * @param {number}  speed     — intervalle de tick en ms (défaut: 40)
 * @param {boolean} trigger   — si false, l'animation ne démarre pas (activation différée)
 *
 * @returns {string} displayText — texte courant à afficher
 */
export function useDecryptText(text, { duration = 800, speed = 40, trigger = true } = {}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !trigger) {
      setDisplayText(text);
      return;
    }

    setDisplayText(text);
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const resolved = Math.floor(progress * text.length);

      const scrambled = text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < resolved) return text[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      setDisplayText(scrambled);

      if (progress >= 1) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text, duration, speed, trigger]);

  return displayText;
}
