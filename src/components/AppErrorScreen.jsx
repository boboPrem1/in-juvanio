export default function AppErrorScreen({ message, slug, theme }) {
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: isDark ? '#080a0f' : '#f8fafc',
        color: isDark ? '#ff4d6d' : '#be123c',
        fontFamily: "'DM Mono', monospace",
        gap: '16px',
        padding: '32px',
      }}
    >
      <div style={{ fontSize: '11px', letterSpacing: '3px', opacity: 0.5 }}>
        PORTFOLIO ENGINE — ERROR
      </div>
      <div style={{ fontSize: '13px', letterSpacing: '1px' }}>
        Failed to load portfolio: <strong>{slug}</strong>
      </div>
      {message && (
        <div
          style={{
            fontSize: '11px',
            opacity: 0.6,
            background: 'rgba(255,77,109,0.08)',
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid rgba(255,77,109,0.2)',
          }}
        >
          {message}
        </div>
      )}
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '16px',
          padding: '8px 24px',
          background: 'transparent',
          border: '1px solid currentColor',
          color: 'inherit',
          fontFamily: 'inherit',
          fontSize: '11px',
          letterSpacing: '2px',
          cursor: 'pointer',
        }}
      >
        RETRY
      </button>
    </div>
  );
}
