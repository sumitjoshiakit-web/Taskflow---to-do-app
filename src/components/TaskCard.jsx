import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TaskCard.css';

function TaskCard({ task, onDelete, onEdit }) {
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
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle && trimmedTitle !== task.title) {
      onEdit(task.id, trimmedTitle);
    }

    if (!trimmedTitle) {
      setEditTitle(task.title);
    }

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveEdit();
    } else if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="task-card-content">
        {isEditing ? (
          <div className="task-edit">
            <input
              type="text"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="task-edit-input"
              aria-label="Edit task title"
            />
            <div className="task-edit-actions">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="btn-save"
                aria-label="Save changes"
              >
                Save
              </button>
              <button
                type="button"
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

              <button
                type="button"
                className="drag-handle"
                {...attributes}
                {...listeners}
                aria-label={`Drag ${task.title}`}
                title="Drag task"
              >
                ⋮⋮
              </button>
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
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-edit"
                aria-label="Edit task"
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="btn-delete"
                aria-label="Delete task"
              >
                🗑️ Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
