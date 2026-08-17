import { DndContext, closestCorners } from '@dnd-kit/core';
import Column from './Column';
import './Board.css';

function Board({
  todoTasks,
  inProgressTasks,
  doneTasks,
  onDelete,
  onEdit,
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
          />
        ))}
      </div>
    </DndContext>
  );
}

export default Board;
