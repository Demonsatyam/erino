import { useState } from "react";
import { login } from "../services/authService";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const { setUser } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await login(form);
      setUser(data?.user);
      nav("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card" onSubmit={onSubmit}>
        <h2>Welcome back</h2>
        <p>Sign in to continue</p>
        {err && <div className="error">{err}</div>}
        <label>Email</label>
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <label>Password</label>
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="primary" type="submit">Login</button>
        <p className="muted">No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}
