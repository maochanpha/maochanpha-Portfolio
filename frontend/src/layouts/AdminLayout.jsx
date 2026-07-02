import { Link, Outlet, useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminLayout() {
  const navigate = useNavigate();

  const adminUser = JSON.parse(localStorage.getItem("admin_user")) || null;

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");

    navigate("/admin/login");
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <h4 className="fw-bold mb-4">Portfolio Admin</h4>

        <nav className="admin-menu">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/skills">Skills</Link>
          <Link to="/admin/projects">Projects</Link>
          <Link to="/admin/ux-ui-projects">UX/UI Projects</Link>
          <Link to="/admin/poster-projects">Poster Projects</Link>
          <Link to="/admin/education">Education</Link>
          <Link to="/admin/experience">Experience</Link>
          <Link to="/admin/messages">Messages</Link>
          <Link to="/admin/profile">Profile</Link>
          <Link to="/">View Website</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h5 className="mb-0">Dashboard</h5>
            <small className="text-muted">
              Welcome, {adminUser?.name || "Admin"}
            </small>
          </div>

          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;