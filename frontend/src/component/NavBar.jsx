import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Navbar() {
  const [name, setName] = useState("");
  const getName = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setName(res.data.name || "");
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    getName();
  });

  return (
    <nav className="navbar" style={{display: "flex"}}>
      <div style={{marginLeft: "20px"}}>
        <h6>Hello, {name}</h6>
      </div>
      <button onClick={handleLogout}
      style={{ backgroundColor: "grey", color: "white", padding: "5px 10px", width: "fit-content", cursor: "pointer", marginLeft: "auto", marginRight: "20px" }}>
        Logout
      </button>
    </nav>
  );
}
