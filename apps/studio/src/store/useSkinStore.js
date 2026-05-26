// src/store/useSkinStore.js
import { create }    from 'zustand';
import { temporal }  from 'zundo';
import { persist }   from 'zustand/middleware';
import { patchSkin } from '../api/skin.api';
import debounce      from 'lodash/debounce';

// ── Utilitaire : écriture par chemin dot ──────────────────────────────────────
function deepSet(obj, path, value) {
  const keys   = path.split('.');
  const result = structuredClone(obj ?? {});
  let cur      = result;
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return result;
}

// Debounce global — un seul timer partagé pour éviter les rafales
const debouncedPatch = debounce(async (slug, patch) => {
  await patchSkin(slug, patch);
}, 800);

// ── Store Zustand : temporal(persist(…)) ─────────────────────────────────────
export const useSkinStore = create(
  temporal(
    persist(
      (set, get) => ({
        skin:        null,
        slug:        null,
        isDirty:     false,
        isSaving:    false,
        lastSavedAt: null,

        setSkin:  (skin) => set({ skin }),
        setSlug:  (slug) => set({ slug }),

        // Mise à jour partielle d'un token + PATCH debounced + postMessage iframe
        updateToken: (path, value) => {
          set((state) => {
            const newSkin = deepSet(state.skin, path, value);

            // Envoie PATCH à l'API (debounced)
            debouncedPatch(state.slug, { [path]: value });

            // Notifie l'iframe preview en temps réel
            const iframe = document.getElementById('previewFrame');
            iframe?.contentWindow?.postMessage(
              { type: 'SKIN_PATCH', payload: { [path]: value } },
              import.meta.env.VITE_ENGINE_ORIGIN ?? '*'
            );

            return { skin: newSkin, isDirty: true };
          });
        },

        markSaved: () => set({ isDirty: false, lastSavedAt: new Date() }),

        setIsSaving: (v) => set({ isSaving: v }),
      }),
      {
        name: 'studio-skin-draft',
        partialize: (state) => ({ skin: state.skin, slug: state.slug }),
      }
    ),
    { limit: 50 }
  )
);

// Accès au store temporal pour undo/redo
export const useTemporalSkinStore = useSkinStore.temporal;
