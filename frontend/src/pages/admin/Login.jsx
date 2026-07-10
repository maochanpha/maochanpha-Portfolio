import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/admin/login", form);

      localStorage.setItem("admin_token", response.data.token);
      localStorage.setItem("admin_user", JSON.stringify(response.data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Admin login failed:", error);
      }

      if (!error.response) {
        setError("Cannot connect to Laravel API. Please check your network connection.");
      } else if ([401, 422].includes(error.response.status)) {
        setError("Invalid email or password.");
      } else {
        const apiMessage = error.response.data?.message;
        setError(
          apiMessage && apiMessage !== "Server Error"
            ? apiMessage
            : `Laravel API returned a server error (HTTP ${error.response.status}).`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h3 className="text-center fw-bold mb-2">Admin Login</h3>

        <p className="text-center text-muted mb-4">
          Login to manage your portfolio
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Admin Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter Admin Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        
      </div>
    </div>
  );
}

export default Login;
