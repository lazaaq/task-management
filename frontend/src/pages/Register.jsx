import { useState } from "react";
import api from "../api/axios";
import '../assets/styles/Login.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState("");
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (password !== passwordConfirmation) {
        setErr("Passwords do not match");
        return;
      }
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.access_token);

      window.location.href = "/";
    } catch (error) {
      setErr(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div class="login-container">
      <form onSubmit={submit}>
        <h1>SIGN UP</h1>
        
        {err && <div className="text-danger">{err}</div>}

        <div class="input-group">
            <label for="name">NAME</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" id="name" />
        </div>
        
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

        <div class="input-group">
            <label for="password_confirmation">PASSWORD CONFIRMATION</label>
            <input value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} type={showPasswordConfirmation ? "text" : "password"} placeholder={showPasswordConfirmation ? "password" : "*********"} id="password_confirmation" />
            <button
              type="button"
              class="password-toggle"
              onClick={() => setShowPasswordConfirmation(prev => !prev)}
            >
              {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
        
        <button type="submit">SIGN UP</button>
        
        <div class="footer">
            Already have an account? <a href="/login">Sign In</a>
        </div>
      </form>
    </div>
  );
}
