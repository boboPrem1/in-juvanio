// src/hooks/useKeyboardShortcuts.js
import { useEffect } from 'react';
import { useTemporalSkinStore } from '../store/useSkinStore';

export function useKeyboardShortcuts() {
  const { undo, redo } = useTemporalSkinStore();

  useEffect(() => {
    const handler = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);
}
