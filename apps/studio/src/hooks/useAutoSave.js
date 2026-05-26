// src/hooks/useAutoSave.js
// Observe les changements isDirty et affiche un indicateur visuel.
// Le PATCH réel est déclenché directement dans useSkinStore.updateToken (debounced).
import { useEffect } from 'react';
import { useSkinStore } from '../store/useSkinStore';

/**
 * @param {Function} onSave — callback appelé quand le skin est marqué comme sauvegardé
 */
export function useAutoSave(onSave) {
  const { isDirty, isSaving, markSaved } = useSkinStore();

  useEffect(() => {
    if (!isDirty || isSaving) return;

    // Surveille la fin du debounce : le PATCH API a été envoyé
    // On marque comme sauvegardé après 900ms (légèrement supérieur au debounce de 800ms)
    const timer = setTimeout(() => {
      markSaved();
      onSave?.();
    }, 900);

    return () => clearTimeout(timer);
  }, [isDirty, isSaving]);
}
