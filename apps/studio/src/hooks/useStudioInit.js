// src/hooks/useStudioInit.js
import { useEffect }      from 'react';
import { useSkinStore }   from '../store/useSkinStore';
import { useDataStore }   from '../store/useDataStore';
import { getSkin }        from '../api/skin.api';
import { getData }        from '../api/data.api';

export function useStudioInit(slug) {
  const { setSkin, setSlug } = useSkinStore();
  const { setData }          = useDataStore();

  useEffect(() => {
    if (!slug) return;
    setSlug(slug);

    // Si un brouillon localStorage existe pour ce slug, proposer de le reprendre
    const draft = useSkinStore.getState().skin;
    const draftSlug = useSkinStore.getState().slug;
    if (draft && draftSlug === slug) {
      const useDraft = window.confirm('Un brouillon non publié existe. Reprendre ?');
      if (useDraft) return;
    }

    // Chargement depuis l'API
    Promise.all([
      getSkin(slug),
      getData(slug, 'fr'),
      getData(slug, 'en'),
    ])
      .then(([skinData, dataFr, dataEn]) => {
        setSkin(skinData);
        setData({ fr: dataFr, en: dataEn });
      })
      .catch((err) => console.error('[useStudioInit] Erreur chargement:', err));
  }, [slug]);
}
