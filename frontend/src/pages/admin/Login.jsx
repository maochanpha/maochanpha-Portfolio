import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

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
      if (!API_URL) {
        throw new Error("VITE_API_URL is not configured.");
      }

      const response = await axios.post(`${API_URL}/admin/login`, form, {
        headers: {
          Accept: "application/json",
        },
      });

      localStorage.setItem("admin_token", response.data.token);
      localStorage.setItem("admin_user", JSON.stringify(response.data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Admin login failed:", error);
      }

      if (error.message === "VITE_API_URL is not configured.") {
        setError("Frontend API URL is not configured. Please redeploy the frontend.");
      } else if (!error.response) {
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
