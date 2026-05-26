// src/components/preview/ViewportToolbar.jsx
export default function ViewportToolbar({ viewports, active, onChange }) {
  return (
    <div className="viewport-toolbar">
      {viewports.map((vp) => (
        <button
          key={vp.id}
          className={`viewport-toolbar__btn ${active === vp.id ? 'active' : ''}`}
          onClick={() => onChange(vp.id)}
          title={`Prévisualiser en ${vp.label}`}
        >
          {vp.id === 'mobile'  && '📱'}
          {vp.id === 'tablet'  && '💻'}
          {vp.id === 'desktop' && '🖥'}
          <span>{vp.label}</span>
        </button>
      ))}
    </div>
  );
}
