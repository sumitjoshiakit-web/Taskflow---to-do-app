import { useState, useCallback } from 'react';
import Board from './components/Board';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

const STORAGE_KEY = 'taskflow-tasks';

function App() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addTask = useCallback((title, priority) => {
    const normalizedTitle = title.trim().toLowerCase();
    if (tasks.some(task => task.title.trim().toLowerCase() === normalizedTitle)) return false;

    const newTask = { id: crypto.randomUUID(), title: title.trim(), priority, status: 'todo' };
    setTasks(prev => [...prev, newTask]);
    setIsFormOpen(false);
    return true;
  }, [tasks, setTasks]);

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, [setTasks]);

  const editTask = useCallback((taskId, newTitle) => {
    const normalizedTitle = newTitle.trim().toLowerCase();
    if (tasks.some(task => task.id !== taskId && task.title.trim().toLowerCase() === normalizedTitle)) return false;

    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, title: newTitle.trim() } : task));
    return true;
  }, [tasks, setTasks]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTasksByStatus = (status) => filteredTasks.filter(task => task.status === status);
  const todoTasks = getTasksByStatus('todo');
  const inProgressTasks = getTasksByStatus('in-progress');
  const doneTasks = getTasksByStatus('done');

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const containerId = over.data.current?.sortable?.containerId;
    const destination = ['todo', 'in-progress', 'done'].includes(over.id) ? over.id : containerId;

    if (!['todo', 'in-progress', 'done'].includes(destination)) return;

    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: destination } : task
    ));
  }, [setTasks]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <h1 className="app-title">📋 Taskflow</h1>
            <p className="app-subtitle">Manage your work efficiently</p>
          </div>
          <button type="button" className="btn-add" onClick={() => setIsFormOpen(true)} aria-label="Add new task">+ Add Task</button>
        </div>
      </header>

      <main className="app-main">
        <div className="app-controls">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <span className="task-count">{filteredTasks.length} tasks</span>
        </div>

        {isFormOpen && <TaskForm tasks={tasks} onAdd={addTask} onCancel={() => setIsFormOpen(false)} />}

        <Board
          todoTasks={todoTasks}
          inProgressTasks={inProgressTasks}
          doneTasks={doneTasks}
          onDelete={deleteTask}
          onEdit={editTask}
          onDragEnd={handleDragEnd}
        />
      </main>

      <footer className="app-footer">
        <p>2026 Taskflow. All rights reserved.</p>
        <div className="social-links" aria-label="Social media links">
          <a href="https://github.com/sumitjoshiakit-web/Taskflow---to-do-app" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" /></svg>
          </a>
          <span className="social-icon" aria-label="LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.83c0-3.76-2-5.51-4.68-5.51-2.16 0-3.12 1.19-3.66 2.03V8.5H9.16V21h3.5v-6.19c0-1.63.31-3.21 2.33-3.21 1.99 0 2.02 1.87 2.02 3.32V21H21v-7.17Z" /></svg>
          </span>
          <span className="social-icon" aria-label="Twitter" title="Twitter">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.8h1.73L8.27 4.08H6.42L17.8 19.8Z" /></svg>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
