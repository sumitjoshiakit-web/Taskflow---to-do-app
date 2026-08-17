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
    </div>
  );
}

export default App;
