import { useEffect, useState } from "react";
import api from "../../api/axios";

function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    messages: 0,
  });

  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const adminResponse = await api.get("/admin/me");
      const skillsResponse = await api.get("/admin/skills");
      const projectsResponse = await api.get("/admin/projects");
      const messagesResponse = await api.get("/admin/contact-messages");

      setAdmin(adminResponse.data.user);

      setStats({
        skills: skillsResponse.data.length,
        projects: projectsResponse.data.length,
        messages: messagesResponse.data.length,
      });
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h3 className="fw-bold">Admin Dashboard</h3>

      <p className="text-muted">
        Manage your portfolio content from this dashboard.
      </p>

      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <div className="admin-stat-card">
            <h5>Skills</h5>
            <h2>{stats.skills}</h2>
            <p>Total skills</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-stat-card">
            <h5>Projects</h5>
            <h2>{stats.projects}</h2>
            <p>Total web projects</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-stat-card">
            <h5>Messages</h5>
            <h2>{stats.messages}</h2>
            <p>Visitor messages</p>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5>Login Admin</h5>

          <p className="mb-1">
            <strong>Name:</strong> {admin?.name}
          </p>

          <p className="mb-0">
            <strong>Email:</strong> {admin?.email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;