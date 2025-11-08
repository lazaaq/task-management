import { useEffect, useState } from "react";
import api from "../api/axios";
import '../assets/styles/Home.css';
import Navbar from "../component/NavBar";


export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    deadline: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Fetch tasks (with filter)
  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params: filter !== "all" ? { status: filter } : {},
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  // 🔹 Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.task_id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        console.log('testing', formData);
        await api.post("/tasks", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ title: "", description: "", status: "todo", deadline: "" });
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save task");
    }
  };

  // 🔹 Handle edit button click
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadline,
    });
  };

  // 🔹 Handle delete
  const handleDelete = async (task_id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${task_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div>
      <Navbar />
    
      <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", color: "black" }} id="homepage-container">

        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* Add Task Button */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{fontSize: "40px"}}>Task Dashboard</h1>
        </div>

        {/* 🔹 Filter dropdown */}
        <div style={{ display: "flex", minWidth: "600px" }}>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{margin:0}}>Status Filter: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{
              fontSize: "12px", padding: "5px", margin: 0
            }}>
              <option value="all">All</option>
              <option value="todo">Todo</option>
              <option value="progress">Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div style={{marginLeft: "auto"}}>
            <button onClick={() => setShowModal(true)} className="add-btn">+ Add Task</button>
          </div>
        </div>

        {/* 🔹 Modal for creating/editing task */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "500px",
              }}
            >
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                  setShowModal(false);
                }}
                style={{
                  textAlign: "left"
                }}
              >
                <label style={{ marginBottom: 0 }}>Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <label style={{ marginBottom: 0, marginTop: "5px" }}>Description</label>
                <textarea
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <label style={{ marginBottom: 0, marginTop: "5px" }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="todo">Todo</option>
                  <option value="progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <label style={{ marginBottom: 0, marginTop: "5px" }}>Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  <button type="submit">{editingTask ? "Update" : "Create"}</button>
                  <button type="button" onClick={() => {
                    setShowModal(false);
                    setFormData({ title: "", description: "", status: "todo", deadline: "" });
                    setEditingTask(null);
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* 🔹 Task list */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.length === 0 && <p>No tasks found.</p>}
          {tasks.map((task) => (
            <li
              key={task.task_id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                display: "flex"
              }}
            >
              <div style={{ textAlign: 'left', marginRight: "10px", minWidth: "400px" }}>
                <strong>{task.title}</strong>
                <br />
                <span style={{ backgroundColor: task.status === "done" ? "var(--accent-green)" : task.status === "progress" ? "var(--accent-yellow)" : "var(--accent-red)", color: "white", padding: "2px 5px", borderRadius: "5px", color: "black", fontSize: "14px", border: "1px solid grey" }}>{task.status}</span>
                <br />
                {task.deadline && (
                  <small>Deadline: {new Date(task.deadline).toLocaleDateString()}</small>
                )}
              </div>
              <div style={{ display: "flex", gap: "5px", marginLeft: "auto" }}>
                <button 
                  onClick={() => {
                    handleEdit(task);
                    setShowModal(true);
                  }}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(task.task_id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
