import { useState } from "react";
import { register } from "../services/authService";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name:"", email: "", password: "" });
  const [err, setErr] = useState("");
  const { setUser } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await register(form);
      setUser(data?.user);
      nav("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card" onSubmit={onSubmit}>
        <h2>Create account</h2>
        {err && <div className="error">{err}</div>}
        <label>Name</label>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <label>Email</label>
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <label>Password</label>
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button className="primary" type="submit">Register</button>
        <p className="muted">Have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
