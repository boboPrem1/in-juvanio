import { useState, useEffect } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ✅ Détecté une seule fois au module level (stable, pas de re-render)
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function DecryptedText({ text, speed = 40, duration = 800 }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    // ✅ Pas d'animation si l'utilisateur a désactivé les animations système
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let intervalId;
    const startTime = Date.now();

    const tick = () => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Progression gauche à droite
      const resolved = Math.floor(progress * text.length);

      const scrambled = text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < resolved)  return text[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      setDisplayText(scrambled);

      if (progress >= 1) {
        clearInterval(intervalId);
        setDisplayText(text);
      }
    };

    intervalId = setInterval(tick, speed);
    return () => clearInterval(intervalId);
  }, [text, speed, duration]);

  return <span>{displayText}</span>;
}
