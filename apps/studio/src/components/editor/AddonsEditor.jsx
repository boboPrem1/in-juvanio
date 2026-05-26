// src/components/editor/AddonsEditor.jsx
import { useSkinStore } from '../../store/useSkinStore';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`toggle ${checked ? 'toggle--on' : 'toggle--off'}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__thumb" />
    </button>
  );
}

function EditorSection({ title, children }) {
  return (
    <div className="editor-section">
      <h3 className="editor-section__title">{title}</h3>
      <div className="editor-section__body">{children}</div>
    </div>
  );
}

const ADDONS = [
  { key: 'customCursor',  label: 'Curseur personnalisé',  desc: 'Curseur animé en remplacement du curseur système' },
  { key: 'bootSequence',  label: 'Boot sequence',          desc: 'Animation de démarrage au premier chargement' },
  { key: 'noiseOverlay',  label: 'Grain / Noise overlay',  desc: 'Texture de grain sur le fond' },
  { key: 'networkCanvas', label: 'Canvas réseau',           desc: 'Animation de particules en arrière-plan' },
];

const CURSOR_TYPES = [
  { value: 'custom',     label: 'Custom (animé)' },
  { value: 'crosshair',  label: 'Crosshair' },
  { value: 'dot',        label: 'Point' },
];

export default function AddonsEditor() {
  const { skin, updateToken } = useSkinStore();
  if (!skin) return <div className="editor-empty">Chargement…</div>;

  const addons = skin.addons ?? {};

  return (
    <div className="addons-editor">
      <EditorSection title="Add-ons actifs">
        {ADDONS.map((addon) => (
          <div key={addon.key} className="addon-row">
            <div className="addon-row__info">
              <strong>{addon.label}</strong>
              <p>{addon.desc}</p>
            </div>
            <Toggle
              checked={!!addons[addon.key]}
              onChange={(val) => updateToken(`addons.${addon.key}`, val)}
            />
          </div>
        ))}
      </EditorSection>

      {addons.customCursor && (
        <EditorSection title="Configuration du curseur">
          <div className="token-row">
            <label className="token-row__label">Type de curseur</label>
            <select
              className="token-row__select"
              value={skin?.cursor?.type ?? 'custom'}
              onChange={(e) => updateToken('cursor.type', e.target.value)}
            >
              {CURSOR_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </EditorSection>
      )}
    </div>
  );
}
