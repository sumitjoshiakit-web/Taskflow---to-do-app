import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TaskCard.css';

function TaskCard({ task, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editError, setEditError] = useState('');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

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
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setEditError('Task name cannot be empty');
      return;
    }

    if (trimmedTitle === task.title) {
      setIsEditing(false);
      setEditError('');
      return;
    }

    const updated = onEdit(task.id, trimmedTitle);
    if (!updated) {
      setEditError('A task with this name already exists');
      return;
    }

    setEditError('');
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditTitle(task.title);
    setEditError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditError('');
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleSaveEdit();
    if (event.key === 'Escape') handleCancelEdit();
  };

  return (
    <div ref={setNodeRef} style={style} className={`task-card ${isDragging ? 'dragging' : ''}`}>
      <div className="task-card-content">
        {isEditing ? (
          <div className="task-edit">
            <input
              type="text"
              value={editTitle}
              onChange={(event) => { setEditTitle(event.target.value); setEditError(''); }}
              onKeyDown={handleKeyDown}
              autoFocus
              className="task-edit-input"
              aria-label="Edit task title"
            />
            {editError && <p className="form-error">{editError}</p>}
            <div className="task-edit-actions">
              <button type="button" onClick={handleSaveEdit} className="btn-save">Save</button>
              <button type="button" onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="task-card-header">
              <span className={`task-priority ${getPriorityClass()}`}>{getPriorityLabel()}</span>
              <button type="button" className="drag-handle" {...attributes} {...listeners} aria-label={`Drag ${task.title}`} title="Drag task">⋮⋮</button>
            </div>

            <h3 className="task-title" onClick={startEditing} title="Click to edit">{task.title}</h3>

            <div className="task-actions">
              <button type="button" onClick={startEditing} className="btn-edit" aria-label="Edit task">✏️ Edit</button>
              <button type="button" onClick={() => onDelete(task.id)} className="btn-delete" aria-label="Delete task">🗑️ Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
