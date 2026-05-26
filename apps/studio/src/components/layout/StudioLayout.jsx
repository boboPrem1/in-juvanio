// src/components/layout/StudioLayout.jsx
import { useParams }              from 'react-router-dom';
import { useStudioInit }          from '../../hooks/useStudioInit';
import { useKeyboardShortcuts }   from '../../hooks/useKeyboardShortcuts';
import StudioTopbar               from './StudioTopbar';
import LeftPanel                  from './LeftPanel';
import RightPanel                 from './RightPanel';

export default function StudioLayout() {
  const { slug } = useParams();
  useStudioInit(slug);
  useKeyboardShortcuts();

  return (
    <div className="studio-shell">
      <StudioTopbar slug={slug} />
      <div className="studio-body">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}
