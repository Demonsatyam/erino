import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = async () => {
    await logout();
    nav("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Erino</div>
        <nav className="nav">
          <NavLink to="/dashboard"><FiHome /> Dashboard</NavLink>
          <NavLink to="/dashboard"><FiUsers /> Leads</NavLink>
          <NavLink to="/settings"><FiSettings /> Settings</NavLink>
        </nav>
        <div className="profile">
          <div className="avatar">{user?.name?.charAt(0)}</div>
          <div className="info">
            <span>{user?.name}</span>
            <span>{user?.email}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div />
          <div className="actions">
            <button className="ghost">Feedback</button>
            <button className="primary">Upgrade</button>
          </div>
        </header>
        <section className="page">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
