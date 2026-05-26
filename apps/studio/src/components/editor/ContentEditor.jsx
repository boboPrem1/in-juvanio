// src/components/editor/ContentEditor.jsx
import { useState, useCallback } from 'react';
import { useParams }             from 'react-router-dom';
import { useDataStore }          from '../../store/useDataStore';
import { patchDataSection }      from '../../api/data.api';
import debounce                  from 'lodash/debounce';
import toast                     from 'react-hot-toast';

const SECTIONS = ['hero', 'skills', 'experience', 'formation', 'contact', 'navbar', 'footer'];

// Renderer générique : génère des champs pour chaque clé string d'un objet plat
function ContentFieldsRenderer({ data, onChange }) {
  if (!data) return <p className="editor-empty">Section vide</p>;

  const renderField = (key, value, prefix = '') => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      const isLong = value.length > 80;
      return (
        <div className="content-field" key={path}>
          <label className="content-field__label">{key}</label>
          {isLong ? (
            <textarea
              className="content-field__textarea"
              defaultValue={value}
              rows={3}
              onChange={(e) => onChange(path, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="content-field__input"
              defaultValue={value}
              onChange={(e) => onChange(path, e.target.value)}
            />
          )}
        </div>
      );
    }

    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
      return (
        <div className="content-field content-field--array" key={path}>
          <label className="content-field__label">{key} (liste)</label>
          {value.map((item, i) => (
            <input
              key={i}
              type="text"
              className="content-field__input"
              defaultValue={item}
              onChange={(e) => onChange(`${path}.${i}`, e.target.value)}
            />
          ))}
        </div>
      );
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div className="content-field content-field--nested" key={path}>
          <span className="content-field__label content-field__label--group">{key}</span>
          <div className="content-field__nested-body">
            {Object.entries(value).map(([k, v]) => renderField(k, v, path))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="content-fields">
      {Object.entries(data).map(([k, v]) => renderField(k, v))}
    </div>
  );
}

export default function ContentEditor() {
  const { slug }   = useParams();
  const { data, setSection } = useDataStore();
  const [lang, setLang]      = useState('fr');
  const [section, setActiveSection] = useState('hero');

  const sectionData = data?.[lang]?.[section] ?? {};

  const handleChange = useCallback(
    debounce(async (key, value) => {
      const updated = { ...sectionData, [key]: value };
      setSection(lang, section, updated);
      try {
        await patchDataSection(slug, lang, section, updated);
      } catch {
        toast.error('Erreur lors de la sauvegarde');
      }
    }, 600),
    [sectionData, lang, section, slug]
  );

  return (
    <div className="content-editor">
      <div className="content-editor__header">
        <select
          className="studio-select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="fr">🇫🇷 Français</option>
          <option value="en">🇬🇧 English</option>
        </select>
        <select
          className="studio-select"
          value={section}
          onChange={(e) => setActiveSection(e.target.value)}
        >
          {SECTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <ContentFieldsRenderer data={sectionData} onChange={handleChange} />
    </div>
  );
}
