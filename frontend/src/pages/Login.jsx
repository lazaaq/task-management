import { useState } from "react";
import api from "../api/axios";
import '../assets/styles/Login.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);

      window.location.href = "/";
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div class="login-container">
      <form onSubmit={submit}>
        <h1>SIGN IN</h1>
        
        {err && <div style={{ color: "red" }}>{err}</div>}

        <div class="input-group">
            <label for="email">EMAIL</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" id="email" />
        </div>
        
        <div class="input-group">
            <label for="password">PASSWORD</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder={showPassword ? "password" : "*********"} id="password" />
            <button
              type="button"
              class="password-toggle"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

        </div>
        
        <button type="submit">SIGN IN</button>
        
        <div class="footer">
            Don't have an account? <a href="/register">Sign Up</a>
        </div>
      </form>
    </div>
  );
}
