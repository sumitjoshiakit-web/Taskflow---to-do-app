import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TaskCard.css';

function TaskCard({ task, onDelete, onEdit, onMove, columnId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getPriorityLabel = () => {
    switch (task.priority) {
      case 'high': return '🔴 High';
      case 'medium': return '🟡 Medium';
      case 'low': return '🟢 Low';
      default: return '';
    }
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      onEdit(task.id, editTitle);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const getMoveButtons = () => {
    const buttons = [];
    if (columnId === 'todo') {
      buttons.push({ label: '→ In Progress', status: 'in-progress' });
    } else if (columnId === 'in-progress') {
      buttons.push({ label: '← To Do', status: 'todo' });
      buttons.push({ label: '→ Done', status: 'done' });
    } else if (columnId === 'done') {
      buttons.push({ label: '← In Progress', status: 'in-progress' });
    }
    return buttons;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-content">
        {isEditing ? (
          <div className="task-edit">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="task-edit-input"
              aria-label="Edit task title"
            />
            <div className="task-edit-actions">
              <button
                onClick={handleSaveEdit}
                className="btn-save"
                aria-label="Save changes"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="btn-cancel"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="task-card-header">
              <span className={`task-priority ${getPriorityClass()}`}>
                {getPriorityLabel()}
              </span>
            </div>
            <h3
              className="task-title"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {task.title}
            </h3>
            <div className="task-actions">
              <button
                onClick={() => setIsEditing(true)}
                className="btn-edit"
                aria-label="Edit task"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="btn-delete"
                aria-label="Delete task"
              >
                🗑️ Delete
              </button>
            </div>
            {getMoveButtons().length > 0 && (
              <div className="task-move">
                {getMoveButtons().map((btn, index) => (
                  <button
                    key={index}
                    onClick={() => onMove(task.id, btn.status)}
                    className="btn-move"
                    aria-label={`Move task to ${btn.label}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
