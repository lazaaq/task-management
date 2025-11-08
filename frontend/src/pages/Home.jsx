import { useEffect, useState } from "react";
import api from "../api/axios";
import '../assets/styles/Home.css';
import Navbar from "../component/NavBar";


export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
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
      console.log('Loading tasks with filter:', filter, 'and sortOrder:', sortOrder);
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: filter, deadline: sortOrder },
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    }
  };
  
  useEffect(() => {
    loadTasks();
  }, [filter, sortOrder]);

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
    
      <div className="container text-dark py-3" id="homepage-container">

        {error && <div className="text-danger">{error}</div>}

        {/* Add Task Button */}
        <div className="mb-5 mt-3">
          <h1 className="fs-1">Task Dashboard</h1>
        </div>


        <div className="d-flex align-items-center min-w-600 mb-2">
          <div>
            List of Tasks
          </div>
          <div className="ms-auto">
            <button onClick={() => setShowModal(true)} className="add-btn">+ Add Task</button>
          </div>
        </div>

        {/* 🔹 Filter dropdown */}
        <div className="d-flex align-items-center min-w-600 mb-2">
          <div className="text-start">
            <label className="mb-0 me-2">Status Filter: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-1 m-0" style={{fontSize: "12px"}}>
              <option value="all">All</option>
              <option value="todo">Todo</option>
              <option value="progress">Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="ms-auto text-start">
            <label className="me-2 mb-0">Deadline Sorting :</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-1 m-0"
              style={{fontSize: "12px"}}
              >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* 🔹 Modal for creating/editing task */}
        {showModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 z-3">
            <div className="bg-white p-3 rounded-3" style={{ width: "500px" }}>
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                  setShowModal(false);
                }}
                className="text-start"
              >
                <label className="mb-0">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <label className="mb-0 mt-2">Description</label>
                <textarea
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <label className="mb-0 mt-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="todo">Todo</option>
                  <option value="progress">Progress</option>
                  <option value="done">Done</option>
                </select>
                <label className="mb-0 mt-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
                <div className="mt-2 d-flex gap-2">
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
        <ul className="list-unstyled p-0" style={{ width: "500px" }}>
          {tasks.length === 0 && <p>No tasks found.</p>}
          {tasks.map((task) => (
            <li
              key={task.task_id}
              className="border rounded-3 p-2 mb-2 d-flex border-secondary"
            >
              <div className="text-start me-2">
                <strong>{task.title}</strong>
                <br />
                <span className={`badge ${task.status === "done" ? "bg-success" : task.status === "progress" ? "bg-warning" : "bg-danger"} border`}>
                  {task.status}
                </span>
                <br />
                {task.deadline && (
                  <small>Deadline: {new Date(task.deadline).toLocaleDateString()}</small>
                )}
              </div>
              <div className="d-flex gap-2" style={{ marginLeft: "auto" }}>
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
