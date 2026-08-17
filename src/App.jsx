import { useState, useCallback, useEffect } from 'react';
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
    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      priority,
      status: 'todo'
    };
    setTasks(prev => [...prev, newTask]);
    setIsFormOpen(false);
  }, [setTasks]);

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, [setTasks]);

  const editTask = useCallback((taskId, newTitle) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, title: newTitle.trim() }
          : task
      )
    );
  }, [setTasks]);

  const moveTask = useCallback((taskId, newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  }, [setTasks]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const todoTasks = getTasksByStatus('todo');
  const inProgressTasks = getTasksByStatus('in-progress');
  const doneTasks = getTasksByStatus('done');

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const destination = over.id;

    const validColumns = ['todo', 'in-progress', 'done'];
    if (!validColumns.includes(destination)) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === destination) return;

    moveTask(taskId, destination);
  }, [tasks, moveTask]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <h1 className="app-title">📋 Taskflow</h1>
            <p className="app-subtitle">Manage your work efficiently</p>
          </div>
          <button
            className="btn-add"
            onClick={() => setIsFormOpen(true)}
            aria-label="Add new task"
          >
            + Add Task
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="app-controls">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <span className="task-count">{filteredTasks.length} tasks</span>
        </div>

        {isFormOpen && (
          <TaskForm
            onAdd={addTask}
            onCancel={() => setIsFormOpen(false)}
          />
        )}

        <Board
          todoTasks={todoTasks}
          inProgressTasks={inProgressTasks}
          doneTasks={doneTasks}
          onDelete={deleteTask}
          onEdit={editTask}
          onMove={moveTask}
          onDragEnd={handleDragEnd}
        />
      </main>
    </div>
  );
}

export default App;
