// src/components/shared/BootSequenceSkeleton.jsx
// Affiché pendant le premier chargement de l'API,
// avant que BootSequenceAddon prenne le relais.
export default function BootSequenceSkeleton() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg, #080a0f)',
      color: 'var(--accent, #00e5c3)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '14px',
      letterSpacing: '2px',
    }}>
      <span>Initializing<span style={{ animation: 'bootBlink 1s step-end infinite' }}>_</span></span>
    </div>
  );
}
