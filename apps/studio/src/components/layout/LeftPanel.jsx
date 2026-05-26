// src/components/layout/LeftPanel.jsx
import { useState }            from 'react';
import TokensEditor            from '../editor/TokensEditor';
import ArchitectureEditor      from '../editor/ArchitectureEditor';
import ContentEditor           from '../editor/ContentEditor';
import AssetsEditor            from '../editor/AssetsEditor';
import AddonsEditor            from '../editor/AddonsEditor';
import HistoryPanel            from '../publish/HistoryPanel';
import PublishButton           from '../publish/PublishButton';

const TABS = [
  { id: 'tokens',       label: 'Thème',      icon: '🎨' },
  { id: 'architecture', label: 'Sections',   icon: '⊞' },
  { id: 'content',      label: 'Contenu',    icon: '✏' },
  { id: 'assets',       label: 'Assets',     icon: '🖼' },
  { id: 'addons',       label: 'Add-ons',    icon: '⚡' },
  { id: 'history',      label: 'Historique', icon: '🕐' },
];

function TabBar({ tabs, active, onChange }) {
  return (
    <nav className="studio-tabbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`studio-tabbar__tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
          title={tab.label}
        >
          <span className="studio-tabbar__icon">{tab.icon}</span>
          <span className="studio-tabbar__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function LeftPanel() {
  const [activeTab, setActiveTab] = useState('tokens');

  return (
    <aside className="left-panel">
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'tokens'       && <TokensEditor />}
        {activeTab === 'architecture' && <ArchitectureEditor />}
        {activeTab === 'content'      && <ContentEditor />}
        {activeTab === 'assets'       && <AssetsEditor />}
        {activeTab === 'addons'       && <AddonsEditor />}
        {activeTab === 'history'      && <HistoryPanel />}
      </div>
      <div className="left-panel__footer">
        <PublishButton />
      </div>
    </aside>
  );
}
