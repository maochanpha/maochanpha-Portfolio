import { useEffect, useState } from "react";
import api from "../../api/axios";

function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    github_url: "",
    live_demo_url: "",
    category: "",
    is_featured: false,
    image: null,
  });

  const getProjects = async () => {
    try {
      const response = await api.get("/admin/projects");
      setProjects(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setPreview(null);

    setForm({
      title: "",
      description: "",
      technologies: "",
      github_url: "",
      live_demo_url: "",
      category: "",
      is_featured: false,
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setForm({
        ...form,
        [name]: file,
      });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

      return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("technologies", form.technologies);
    formData.append("github_url", form.github_url);
    formData.append("live_demo_url", form.live_demo_url);
    formData.append("category", form.category);
    formData.append("is_featured", form.is_featured ? 1 : 0);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editingId) {
        formData.append("_method", "PUT");

        await api.post(`/admin/projects/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Project updated successfully.");
      } else {
        await api.post("/admin/projects", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Project created successfully.");
      }

      resetForm();
      getProjects();
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        alert(firstError);
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      description: project.description || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      github_url: project.github_url || "",
      live_demo_url: project.live_demo_url || "",
      category: project.category || "",
      is_featured: project.is_featured || false,
      image: null,
    });

    setPreview(project.image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/admin/projects/${id}`);

      setMessage("Project deleted successfully.");
      getProjects();
    } catch (error) {
      console.log(error);
      alert("Failed to delete project.");
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div>
      <h3 className="fw-bold">Projects Management</h3>
      <p className="text-muted">
        Add, edit, and delete your web development projects.
      </p>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            {editingId ? "Edit Project" : "Add New Project"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Example: Portfolio Website"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  placeholder="Example: Full Stack"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Write project description..."
                  value={form.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Technologies</label>
                <input
                  type="text"
                  name="technologies"
                  className="form-control"
                  placeholder="Laravel, React JS, MySQL, Bootstrap"
                  value={form.technologies}
                  onChange={handleChange}
                />
                <small className="text-muted">
                  Separate technologies with comma.
                </small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">GitHub Link</label>
                <input
                  type="url"
                  name="github_url"
                  className="form-control"
                  placeholder="https://github.com/..."
                  value={form.github_url}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Live Demo Link</label>
                <input
                  type="url"
                  name="live_demo_url"
                  className="form-control"
                  placeholder="https://example.com"
                  value={form.live_demo_url}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Project Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3 d-flex align-items-end">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="is_featured"
                    className="form-check-input"
                    checked={form.is_featured}
                    onChange={handleChange}
                    id="isFeatured"
                  />

                  <label className="form-check-label" htmlFor="isFeatured">
                    Featured Project
                  </label>
                </div>
              </div>
            </div>

            {preview && (
              <div className="mb-3">
                <p className="mb-1">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="admin-project-preview"
                />
              </div>
            )}

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Project"
                    : "Add Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Project List</h5>

          <div className="table-responsive">
            <table className="table align-middle projects-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Technologies</th>
                  <th>Featured</th>
                  <th width="190">Action</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="admin-project-img"
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>

                    <td>
                      <strong>{project.title}</strong>
                      <br />
                      <small className="text-muted">
                        {project.description?.slice(0, 70)}...
                      </small>
                    </td>

                    <td>{project.category || "N/A"}</td>

                    <td>
                      {Array.isArray(project.technologies) &&
                        project.technologies.map((tech, index) => (
                          <span
                            className="badge bg-light text-dark me-1 mb-1"
                            key={index}
                          >
                            {tech}
                          </span>
                        ))}
                    </td>

                    <td>
                      {project.is_featured ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {projects.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsAdmin;