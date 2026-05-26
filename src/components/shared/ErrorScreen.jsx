// src/components/shared/ErrorScreen.jsx
// Écran d'erreur si l'API retourne une erreur ou le chargement échoue.
export default function ErrorScreen({ message, slug }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      background: 'var(--bg, #080a0f)',
      color: 'var(--accent2, #ff4d6d)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '13px',
      gap: '1rem',
      padding: '2rem',
    }}>
      <span style={{ fontSize: '2rem' }}>⚠</span>
      <strong>Erreur de chargement{slug ? ` — ${slug}` : ''}</strong>
      {message && <code style={{ color: 'var(--muted)' }}>{message}</code>}
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '1rem', padding: '0.5rem 1.5rem',
          background: 'transparent',
          border: '1px solid var(--accent2, #ff4d6d)',
          color: 'var(--accent2, #ff4d6d)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '13px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      >
        Réessayer
      </button>
    </div>
  );
}
