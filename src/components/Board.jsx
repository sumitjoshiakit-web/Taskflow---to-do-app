import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import './Board.css';

function Board({
  todoTasks,
  inProgressTasks,
  doneTasks,
  onDelete,
  onEdit,
  onMove,
  onDragEnd
}) {
  const columns = [
    { id: 'todo', title: 'To Do', tasks: todoTasks, color: 'todo' },
    { id: 'in-progress', title: 'In Progress', tasks: inProgressTasks, color: 'progress' },
    { id: 'done', title: 'Done', tasks: doneTasks, color: 'done' }
  ];

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={onDragEnd}
    >
      <div className="board">
        {columns.map(column => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={column.tasks}
            color={column.color}
            onDelete={onDelete}
            onEdit={onEdit}
            onMove={onMove}
          />
        ))}
      </div>
    </DndContext>
  );
}

export default Board;
