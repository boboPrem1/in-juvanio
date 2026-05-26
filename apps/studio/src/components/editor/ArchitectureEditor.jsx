// src/components/editor/ArchitectureEditor.jsx
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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

export default function ArchitectureEditor() {
  const { skin, updateToken } = useSkinStore();
  const arch = skin?.architecture ?? [];

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(arch);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    updateToken('architecture', reordered);
  };

  const toggleVisible = (id) => {
    const updated = arch.map((block) =>
      block.id === id ? { ...block, enabled: !block.enabled } : block
    );
    updateToken('architecture', updated);
  };

  if (!skin) return <div className="editor-empty">Chargement…</div>;

  return (
    <div className="arch-editor">
      <p className="arch-editor__hint">
        Glissez pour réordonner · Basculez pour masquer une section
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="architecture">
          {(provided) => (
            <ul
              className="arch-editor__list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {arch.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`arch-editor__item ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <span
                        {...provided.dragHandleProps}
                        className="arch-editor__handle"
                        title="Glisser pour réordonner"
                      >
                        ⠿
                      </span>
                      <span className="arch-editor__name">{block.component}</span>
                      <Toggle
                        checked={block.enabled !== false}
                        onChange={() => toggleVisible(block.id)}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
