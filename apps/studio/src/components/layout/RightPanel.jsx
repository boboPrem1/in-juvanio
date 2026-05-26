// src/components/layout/RightPanel.jsx
import { useState }       from 'react';
import PreviewFrame       from '../preview/PreviewFrame';
import ViewportToolbar    from '../preview/ViewportToolbar';

const VIEWPORTS = [
  { id: 'mobile',  label: '375px', width: 375 },
  { id: 'tablet',  label: '768px', width: 768 },
  { id: 'desktop', label: '100%',  width: '100%' },
];

export default function RightPanel() {
  const [viewport, setViewport] = useState('desktop');
  const current = VIEWPORTS.find((v) => v.id === viewport);

  return (
    <section className="right-panel">
      <ViewportToolbar
        viewports={VIEWPORTS}
        active={viewport}
        onChange={setViewport}
      />
      <div className="preview-container">
        <PreviewFrame width={current.width} />
      </div>
    </section>
  );
}
