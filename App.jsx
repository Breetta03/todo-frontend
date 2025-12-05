import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("pending"); // "pending" | "completed" | "all"
  const [showConfetti, setShowConfetti] = useState(false);

  // Load tasks from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(tasks));
  }, [tasks]);

  const addOrUpdateTask = () => {
    if (task.trim() === "") return;

    if (editingId) {
      // update existing task
      const updated = tasks.map((t) =>
        t.id === editingId ? { ...t, text: task, priority } : t
      );
      setTasks(updated);
      setEditingId(null);
    } else {
      // create new task
      const newTask = {
        id: Date.now(),
        text: task,
        completed: false,
        priority: priority,
        time: new Date().toLocaleString(),
      };
      setTasks([...tasks, newTask]);
    }

    setTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) => {
      const clickedTask = prevTasks.find((t) => t.id === id);

      const updated = prevTasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );

      // If it was pending and now becoming completed → celebrate 🎉
      if (clickedTask && !clickedTask.completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 900);
      }

      return updated;
    });
  };

  const editTask = (taskObj) => {
    setTask(taskObj.text);
    setPriority(taskObj.priority);
    setEditingId(taskObj.id);
  };

  const clearAll = () => {
    setTasks([]);
    setEditingId(null);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  // Filtered list based on selected tab
  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true; // all
  });

  const emptyText =
    filter === "pending"
      ? "No pending tasks... add something! ✨"
      : filter === "completed"
      ? "No completed tasks yet... keep going! 💪"
      : "No tasks yet... start by adding one! 💡";

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className="app-card">
        {/* Confetti Overlay */}
        {showConfetti && (
          <div className="confetti-wrapper">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className={`confetti-piece c-${(i % 6) + 1}`} />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="app-header">
          <h1 className="app-title">💗 My To-Do List 💗</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Tabs (Pending / Completed / All) */}
        <div className="tabs-container">
          <div className="tabs">
            <div className={`tab-slider ${filter}`}></div>

            <button
              className={`tab-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`tab-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
            <button
              className={`tab-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="input-row">
          <input
            type="text"
            placeholder="Type your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="task-input"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="priority-select"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button className="add-btn" onClick={addOrUpdateTask}>
            {editingId ? "Update" : "Add"}
          </button>
        </div>

        {/* Clear Button */}
        {tasks.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            Clear All Tasks
          </button>
        )}

        {/* Task List */}
        <ul className="todo-list">
          {filteredTasks.map((t) => (
            <li
              key={t.id}
              className={`todo-item priority-${t.priority.toLowerCase()} ${
                t.completed ? "completed" : ""
              }`}
            >
              <div className="todo-main">
                <span className="todo-text">{t.text}</span>
                <span className="todo-meta">
                  Priority: <b>{t.priority}</b> • {t.time}
                </span>
              </div>

              <div className="todo-actions">
                <button
                  className="icon-btn complete"
                  onClick={() => toggleComplete(t.id)}
                  title="Mark complete"
                >
                  ✓
                </button>
                <button
                  className="icon-btn edit"
                  onClick={() => editTask(t)}
                  title="Edit task"
                >
                  ✏️
                </button>
                <button
                  className="icon-btn delete"
                  onClick={() => deleteTask(t.id)}
                  title="Delete task"
                >
                  ❌
                </button>
              </div>
            </li>
          ))}

          {filteredTasks.length === 0 && (
            <p className="empty-text">{emptyText}</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
