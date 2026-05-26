// src/components/shared/DecryptedText.jsx
// Refactorisé en Phase 4 — wrapper rétrocompatible autour de useDecryptText.
// Interface identique à l'ancien composant, zéro modification requise dans les appelants.
import { useDecryptText } from '../../hooks/useDecryptText';

export default function DecryptedText({ text, speed = 40, duration = 800 }) {
  const displayText = useDecryptText(text, { duration, speed });
  return <span>{displayText}</span>;
}
