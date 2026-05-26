// src/store/useDataStore.js
import { create } from 'zustand';

export const useDataStore = create((set, get) => ({
  data: null, // { fr: {...}, en: {...} }

  setData: (data) => set({ data }),

  setSection: (lang, section, value) => {
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...(state.data?.[lang] ?? {}),
          [section]: value,
        },
      },
    }));
  },
}));
