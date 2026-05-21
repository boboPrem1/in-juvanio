import { useState, useEffect } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function DecryptedText({ text, speed = 40, duration = 800 }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let intervalId;
    let startTime = Date.now();

    const tick = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Progression gauche à droite
      const resolvedCount = Math.floor(progress * text.length);

      const scrambled = text.split('').map((char, i) => {
        // Garder les espaces intacts pour ne pas casser la mise en page
        if (char === ' ') return ' ';
        // Résoudre les caractères progressivement
        if (i < resolvedCount) {
          return text[i];
        }
        // Afficher des caractères aléatoires pour le reste
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
