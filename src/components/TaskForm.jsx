import { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }
    setError('');
    onAdd(title, priority);
    setTitle('');
    setPriority('medium');
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <h2 className="task-form-title">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="form-input"
              autoFocus
              aria-describedby={error ? 'task-error' : undefined}
            />
            {error && (
              <p id="task-error" className="form-error">
                {error}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-select"
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Add Task
            </button>
            <button type="button" onClick={onCancel} className="btn-cancel-form">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
