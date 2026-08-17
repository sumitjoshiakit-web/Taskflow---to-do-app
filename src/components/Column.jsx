import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import './Column.css';

function Column({ id, title, tasks, color, onDelete, onEdit }) {
  const { setNodeRef } = useDroppable({ id });

  const getColorClass = () => {
    switch (color) {
      case 'todo': return 'column-todo';
      case 'progress': return 'column-progress';
      case 'done': return 'column-done';
      default: return '';
    }
  };

  return (
    <div className={`column ${getColorClass()}`}>
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div ref={setNodeRef} className="column-content">
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="column-empty">
              <span className="empty-icon">📭</span>
              <p>No tasks yet</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default Column;
