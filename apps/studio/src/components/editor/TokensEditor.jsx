// src/components/editor/TokensEditor.jsx
import { useSkinStore } from '../../store/useSkinStore';

// ── Composants atomiques ──────────────────────────────────────────────────────

function EditorSection({ title, children }) {
  return (
    <div className="editor-section">
      <h3 className="editor-section__title">{title}</h3>
      <div className="editor-section__body">{children}</div>
    </div>
  );
}

function ColorRow({ label, path, value, onChange }) {
  return (
    <div className="token-row">
      <label className="token-row__label">{label}</label>
      <div className="color-input-group">
        <input
          type="color"
          className="color-input-group__swatch"
          value={value || '#000000'}
          onChange={(e) => onChange(path, e.target.value)}
        />
        <input
          type="text"
          className="color-input-group__hex"
          value={value || ''}
          maxLength={9}
          onChange={(e) => {
            if (/^#[0-9A-Fa-f]{0,8}$/.test(e.target.value)) {
              onChange(path, e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
}

function SliderRow({ label, path, value, unit = '', min = 0, max = 100, step = 1, onChange }) {
  const num = parseFloat(value) || 0;
  return (
    <div className="token-row">
      <label className="token-row__label">
        {label}
        <span className="token-row__value">{num}{unit}</span>
      </label>
      <input
        type="range"
        className="token-row__slider"
        min={min}
        max={max}
        step={step}
        value={num}
        onChange={(e) => onChange(path, parseFloat(e.target.value))}
      />
    </div>
  );
}

function FontSelector({ label, path, value, onChange }) {
  const FONTS = [
    "'DM Mono', monospace",
    "'JetBrains Mono', monospace",
    "'Fira Code', monospace",
    "system-ui, sans-serif",
    "'Inter', sans-serif",
    "'Syne', sans-serif",
    "'Fraunces', serif",
  ];
  return (
    <div className="token-row">
      <label className="token-row__label">{label}</label>
      <select
        className="token-row__select"
        value={value || ''}
        onChange={(e) => onChange(path, e.target.value)}
      >
        {FONTS.map((f) => (
          <option key={f} value={f}>{f.split(',')[0].replace(/'/g, '')}</option>
        ))}
      </select>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function TokensEditor() {
  const { skin, updateToken } = useSkinStore();
  if (!skin) return <div className="editor-empty">Chargement du skin…</div>;

  const dk = skin.theme?.dark  ?? {};
  const lk = skin.theme?.light ?? {};
  const ty = skin.typography   ?? {};
  const du = skin.animations?.durations ?? {};

  return (
    <div className="tokens-editor">
      <EditorSection title="Couleurs — Mode sombre">
        <ColorRow label="Fond principal"   path="theme.dark.--bg"      value={dk['--bg']}      onChange={updateToken} />
        <ColorRow label="Surface"          path="theme.dark.--surface" value={dk['--surface']} onChange={updateToken} />
        <ColorRow label="Accent"           path="theme.dark.--accent"  value={dk['--accent']}  onChange={updateToken} />
        <ColorRow label="Accent 2"         path="theme.dark.--accent2" value={dk['--accent2']} onChange={updateToken} />
        <ColorRow label="Texte"            path="theme.dark.--text"    value={dk['--text']}    onChange={updateToken} />
        <ColorRow label="Muted"            path="theme.dark.--muted"   value={dk['--muted']}   onChange={updateToken} />
      </EditorSection>

      <EditorSection title="Couleurs — Mode clair">
        <ColorRow label="Fond principal"   path="theme.light.--bg"      value={lk['--bg']}      onChange={updateToken} />
        <ColorRow label="Surface"          path="theme.light.--surface" value={lk['--surface']} onChange={updateToken} />
        <ColorRow label="Accent"           path="theme.light.--accent"  value={lk['--accent']}  onChange={updateToken} />
        <ColorRow label="Texte"            path="theme.light.--text"    value={lk['--text']}    onChange={updateToken} />
        <ColorRow label="Muted"            path="theme.light.--muted"   value={lk['--muted']}   onChange={updateToken} />
      </EditorSection>

      <EditorSection title="Typographie">
        <FontSelector label="Police mono"    path="typography.--font-mono"    value={ty['--font-mono']}    onChange={updateToken} />
        <FontSelector label="Police titres"  path="typography.--font-heading" value={ty['--font-heading']} onChange={updateToken} />
        <FontSelector label="Police corps"   path="typography.--font-body"    value={ty['--font-body']}    onChange={updateToken} />
      </EditorSection>

      <EditorSection title="Animations">
        <SliderRow label="Durée courte"  path="animations.durations.short"  value={du.short}  unit="ms" min={100} max={600}  step={50} onChange={updateToken} />
        <SliderRow label="Durée moyenne" path="animations.durations.medium" value={du.medium} unit="ms" min={300} max={1500} step={50} onChange={updateToken} />
        <SliderRow label="Durée longue"  path="animations.durations.long"   value={du.long}   unit="ms" min={600} max={3000} step={100} onChange={updateToken} />
        <SliderRow label="Parallax grid" path="animations.parallax.heroGrid"  value={skin.animations?.parallax?.heroGrid}  unit="" min={0} max={0.5} step={0.01} onChange={updateToken} />
        <SliderRow label="Parallax photo" path="animations.parallax.heroPhoto" value={skin.animations?.parallax?.heroPhoto} unit="" min={0} max={0.3} step={0.01} onChange={updateToken} />
      </EditorSection>
    </div>
  );
}
