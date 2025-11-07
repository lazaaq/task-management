import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NjI1MjI0MzksImV4cCI6MTc2MjUyNjAzOSwibmJmIjoxNzYyNTIyNDM5LCJqdGkiOiJ1aUxqd3NHdmtBZjJVRk9QIiwic3ViIjoiMyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.HrzD3F8wDzojDIbDsS6YIBXuoZW0XGGB5RxqqA6W3GU"
        const res = await api.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data.tasks || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tasks");
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2>Tasks</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

  