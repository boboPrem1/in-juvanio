// src/components/shared/DecryptedText.jsx
// Wrapper rétrocompatible autour de useDecryptText.
// Interface identique à l'ancien composant — aucune modification requise dans les composants appelants.
import { useDecryptText } from '../../hooks/useDecryptText';

export default function DecryptedText({ text, speed = 40, duration = 800 }) {
  const displayText = useDecryptText(text, { duration, speed });
  return <span>{displayText}</span>;
}
