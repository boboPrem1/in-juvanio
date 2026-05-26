// src/components/shared/DecryptedText.jsx
// Déplacé depuis components/DecryptedText.jsx — contenu identique
import { useState, useEffect } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function DecryptedText({ text, speed = 40, duration = 800 }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let intervalId;
    const startTime = Date.now();

    const tick = () => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
