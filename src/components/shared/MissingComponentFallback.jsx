// src/components/shared/MissingComponentFallback.jsx
/**
 * Affiché quand skin.architecture référence une clé absente du REGISTRY.
 * Invisible en production — bloc d'alerte rouge en développement.
 */
export default function MissingComponentFallback({ name }) {
  if (import.meta.env.PROD) return null;

  return (
    <div style={{
      border: '2px dashed var(--accent2, #ff4d6d)',
      borderRadius: '8px',
      padding: '2rem',
      margin: '1rem 0',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '13px',
      color: 'var(--accent2, #ff4d6d)',
      background: 'rgba(255, 77, 109, 0.05)',
    }}>
      <strong>[DEV] Composant introuvable dans le registry :</strong>{' '}
      <code>&quot;{name}&quot;</code>
      <p style={{ marginTop: '0.5rem', color: 'var(--muted)' }}>
        Vérifier que ce composant est bien enregistré dans{' '}
        <code>src/registry/Registry.js</code>
        {' '}et que la clé correspond exactement à{' '}
        <code>skin.architecture[n].component</code>.
      </p>
    </div>
  );
}
