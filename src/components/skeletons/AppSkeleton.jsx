// src/components/skeletons/AppSkeleton.jsx
// Affiché pendant status === 'loading' || language === null
// Reproduit la structure Nav + Hero + 2 sections avec effect shimmer

export default function AppSkeleton({ theme }) {
  const isDark  = theme === 'dark';
  const bg      = isDark ? '#080a0f' : '#f8fafc';

  return (
    <div style={{ minHeight: '100vh', background: bg }}>
      {/* Navbar skeleton */}
      <div
        style={{
          height: '60px',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.12)'}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          gap: '32px',
        }}
      >
        {[80, 70, 60, 90, 70].map((w, i) => (
          <div
            key={i}
            className="skeleton-block"
            style={{ width: w, height: 12, borderRadius: 2 }}
          />
        ))}
      </div>

      {/* Hero skeleton */}
      <HeroSkeleton />

      {/* Sections minimales */}
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <section
      style={{
        display: 'flex',
        padding: '120px 64px',
        gap: '64px',
        minHeight: '80vh',
        alignItems: 'center',
      }}
    >
      {/* Left col */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton-block" style={{ width: 200, height: 14 }} />
        <div className="skeleton-block" style={{ width: 320, height: 48 }} />
        <div className="skeleton-block" style={{ width: 280, height: 48 }} />
        <div className="skeleton-block" style={{ width: 240, height: 48 }} />
        <div className="skeleton-block" style={{ width: '80%', height: 12, marginTop: 16 }} />
        <div className="skeleton-block" style={{ width: '65%', height: 12 }} />
        <div style={{ display: 'flex', gap: '12px', marginTop: 24 }}>
          <div className="skeleton-block" style={{ width: 140, height: 44, borderRadius: 4 }} />
          <div className="skeleton-block" style={{ width: 120, height: 44, borderRadius: 4 }} />
          <div className="skeleton-block" style={{ width: 130, height: 44, borderRadius: 4 }} />
        </div>
      </div>

      {/* Right col — photo frame placeholder */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div
          className="skeleton-block"
          style={{ width: 360, height: 420, borderRadius: 8 }}
        />
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <section
      style={{
        padding: '80px 64px',
        borderTop: '1px solid rgba(128,128,128,0.08)',
      }}
    >
      <div className="skeleton-block" style={{ width: 100, height: 11, marginBottom: 24 }} />
      <div className="skeleton-block" style={{ width: 280, height: 40, marginBottom: 8 }} />
      <div className="skeleton-block" style={{ width: 220, height: 40, marginBottom: 40 }} />
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-block"
            style={{ height: 180, borderRadius: 4 }}
          />
        ))}
      </div>
    </section>
  );
}
