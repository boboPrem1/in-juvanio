import { useState, useEffect } from 'react';

let cachedSkin = null;

export function useSkinData() {
  const [skin, setSkin] = useState(cachedSkin);
  const [loading, setLoading] = useState(!cachedSkin);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedSkin) {
      setSkin(cachedSkin);
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch('/skin.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load skin.json: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          cachedSkin = json;
          setSkin(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[useSkinData]', err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return { skin, loading, error };
}
