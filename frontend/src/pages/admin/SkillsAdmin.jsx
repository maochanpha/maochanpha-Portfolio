import { useEffect, useState } from "react";
import api from "../../api/axios";

function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "",
    sort_order: "",
    is_active: true,
    icon: null,
  });

  const getSkills = async () => {
    try {
      const response = await api.get("/admin/skills");
      setSkills(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setPreview(null);
    setForm({
      name: "",
      category: "",
      level: "",
      sort_order: "",
      is_active: true,
      icon: null,
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

    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("level", form.level);
    formData.append("sort_order", form.sort_order || 0);
    formData.append("is_active", form.is_active ? 1 : 0);

    if (form.icon) {
      formData.append("icon", form.icon);
    }

    try {
      if (editingId) {
        formData.append("_method", "PUT");

        await api.post(`/admin/skills/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Skill updated successfully.");
      } else {
        await api.post("/admin/skills", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Skill created successfully.");
      }

      resetForm();
      getSkills();
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

  const handleEdit = (skill) => {
    setEditingId(skill.id);

    setForm({
      name: skill.name || "",
      category: skill.category || "",
      level: skill.level || "",
      sort_order: skill.sort_order || "",
      is_active: skill.is_active,
      icon: null,
    });

    setPreview(skill.icon_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this skill?");

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/admin/skills/${id}`);

      setMessage("Skill deleted successfully.");
      getSkills();
    } catch (error) {
      console.log(error);
      alert("Failed to delete skill.");
    }
  };

  if (loading) {
    return <p>Loading skills...</p>;
  }

  return (
    <div>
      <h3 className="fw-bold">Skills Management</h3>
      <p className="text-muted">Add, edit, and delete your portfolio skills.</p>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            {editingId ? "Edit Skill" : "Add New Skill"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Example: Laravel"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Design">Design</option>
                  <option value="Tool">Tool</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Level (%)</label>
                <input
                  type="number"
                  name="level"
                  className="form-control"
                  placeholder="80"
                  value={form.level}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  className="form-control"
                  placeholder="1"
                  value={form.sort_order}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Icon/Image</label>
                <input
                  type="file"
                  name="icon"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            </div>

            {preview && (
              <div className="mb-3">
                <p className="mb-1">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="admin-image-preview"
                />
              </div>
            )}

            <div className="form-check mb-3">
              <input
                type="checkbox"
                name="is_active"
                className="form-check-input"
                checked={form.is_active}
                onChange={handleChange}
                id="isActive"
              />

              <label className="form-check-label" htmlFor="isActive">
                Active
              </label>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
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
          <h5 className="mb-3">Skill List</h5>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th width="180">Action</th>
                </tr>
              </thead>

              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id}>
                    <td>
                      {skill.icon_url ? (
                        <img
                          src={skill.icon_url}
                          alt={skill.name}
                          className="admin-table-img"
                        />
                      ) : (
                        <span className="text-muted">No Icon</span>
                      )}
                    </td>

                    <td>{skill.name}</td>
                    <td>{skill.category}</td>

                    <td>
                      <div className="progress" style={{ height: "20px" }}>
                        <div
                          className="progress-bar"
                          style={{ width: `${skill.level}%` }}
                        >
                          {skill.level}%
                        </div>
                      </div>
                    </td>

                    <td>
                      {skill.is_active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary">Inactive</span>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(skill)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(skill.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {skills.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No skills found.
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

export default SkillsAdmin;