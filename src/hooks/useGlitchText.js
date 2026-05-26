// src/hooks/useGlitchText.js
import { useState, useRef, useCallback } from 'react';
import { prefersReducedMotion } from './utils/prefersReducedMotion';

const GLITCH_CHARS = '!<>-_\\/[]{}=+*^?#@&%$';

/**
 * Applique un effet glitch (caractères aléatoires) au survol ou sur déclenchement.
 *
 * @param {string}  text       — texte original
 * @param {object}  options
 * @param {number}  options.intensity  — fraction du texte glitchée (0 à 1, défaut: 0.4)
 * @param {number}  options.frequency  — intervalle du tick en ms (défaut: 50)
 * @param {number}  options.duration   — durée totale de l'effet en ms (défaut: 400)
 *
 * @returns {{ displayText, glitchHandlers }}
 */
export function useGlitchText(text, {
  intensity = 0.4,
  frequency = 50,
  duration  = 400,
} = {}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const timeoutRef  = useRef(null);

  const startGlitch = useCallback(() => {
    if (prefersReducedMotion() || intensity === 0) return;

    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);

    intervalRef.current = setInterval(() => {
      const glitched = text.split('').map(char => {
        if (char === ' ') return ' ';
        if (Math.random() < intensity) {
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        return char;
      }).join('');
      setDisplayText(glitched);
    }, frequency);

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setDisplayText(text);
    }, duration);
  }, [text, intensity, frequency, duration]);

  const stopGlitch = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    setDisplayText(text);
  }, [text]);

  return {
    displayText,
    glitchHandlers: {
      onMouseEnter: startGlitch,
      onMouseLeave: stopGlitch,
      onFocus:      startGlitch,
      onBlur:       stopGlitch,
    },
  };
}
