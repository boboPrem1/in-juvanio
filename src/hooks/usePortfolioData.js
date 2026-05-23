import { useState, useEffect } from 'react';

let cachedData = null;

export function usePortfolioData() {
  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch('/data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data.json: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          cachedData = json;
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[usePortfolioData]', err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
