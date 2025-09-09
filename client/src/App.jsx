import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/viewalltasks/');
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task
  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/createtodo/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask, status: false }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks([data.data, ...tasks]); // Add new task to top of list
        setNewTask(''); // Clear input
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/cleartodo/${id}/`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Toggle task completion
  const markComplete = async (task) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/updatetodo/${task.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !task.status }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: !t.status } : t)));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Update task name
  const updateTask = async (task) => {
    const newTaskName = prompt('Enter new task name', task.task);
    if (!newTaskName) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/updatetodo/${task.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTaskName }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(tasks.map((t) => (t.id === task.id ? { ...t, task: newTaskName } : t)));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>My Todo List</h1>
      </header>

      {/* Create Task Form */}
      <form className="task-form" onSubmit={createTask}>
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="task-container">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="no-tasks">No tasks found!</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.status ? 'completed' : ''}`}>
              <div className="task-content">
                <h3>{task.task}</h3>
                <p>Status: {task.status ? 'Completed ✅' : 'Pending ❌'}</p>
              </div>
              <div className="task-buttons">
                <button onClick={() => deleteTask(task.id)} className="delete-btn">
                  Delete
                </button>
                <button onClick={() => updateTask(task)} className="update-btn">
                  Update
                </button>
                <button onClick={() => markComplete(task)} className="complete-btn">
                  {task.status ? 'Undo Complete' : 'Mark Complete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
