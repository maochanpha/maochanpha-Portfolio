import { useEffect, useState } from "react";
import api from "../../api/axios";

function ExperienceAdmin() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    organization: "",
    role: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    certificate_image: null,
  });

  const getExperiences = async () => {
    try {
      const response = await api.get("/admin/experience");

      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setExperiences(list);
    } catch (error) {
      console.log(error);
      alert("Failed to load experience.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExperiences();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setPreview(null);

    setForm({
      organization: "",
      role: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      certificate_image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setForm({
        ...form,
        certificate_image: file,
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

    formData.append("organization", form.organization);
    formData.append("role", form.role);
    formData.append("start_date", form.start_date || "");
    formData.append("end_date", form.is_current ? "" : form.end_date || "");
    formData.append("is_current", form.is_current ? 1 : 0);
    formData.append("description", form.description);

    if (form.certificate_image) {
      formData.append("certificate_image", form.certificate_image);
    }

    try {
      if (editingId) {
        formData.append("_method", "PUT");

        await api.post(`/admin/experience/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Experience updated successfully.");
      } else {
        await api.post("/admin/experience", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Experience created successfully.");
      }

      resetForm();
      getExperiences();
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

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      organization: item.organization || "",
      role: item.role || "",
      start_date: item.start_date ? item.start_date.slice(0, 10) : "",
      end_date: item.end_date ? item.end_date.slice(0, 10) : "",
      is_current: item.is_current || false,
      description: item.description || "",
      certificate_image: null,
    });

    setPreview(item.certificate_image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/admin/experience/${id}`);

      setMessage("Experience deleted successfully.");
      getExperiences();
    } catch (error) {
      console.log(error);
      alert("Failed to delete experience.");
    }
  };

  if (loading) {
    return <p>Loading experience...</p>;
  }

  return (
    <div>
      <h3 className="fw-bold">Experience Management</h3>
      <p className="text-muted">
        Add, edit, and delete your volunteer or work experience.
      </p>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            {editingId ? "Edit Experience" : "Add New Experience"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Organization Name</label>
                <input
                  type="text"
                  name="organization"
                  className="form-control"
                  placeholder="Example: Volunteer Team"
                  value={form.organization}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Position / Role</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  placeholder="Example: Volunteer Designer"
                  value={form.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  className="form-control"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  className="form-control"
                  value={form.end_date}
                  onChange={handleChange}
                  disabled={form.is_current}
                />
              </div>

              <div className="col-md-12 mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="is_current"
                    className="form-check-input"
                    checked={form.is_current}
                    onChange={handleChange}
                    id="isCurrentExperience"
                  />

                  <label
                    className="form-check-label"
                    htmlFor="isCurrentExperience"
                  >
                    I am currently working / volunteering here
                  </label>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Write short description..."
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Certificate / Image</label>
                <input
                  type="file"
                  name="certificate_image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            </div>

            {preview && (
              <div className="mb-3">
                <p className="mb-2">Preview:</p>

                <img
                  src={preview}
                  alt="Preview"
                  className="admin-experience-preview"
                />
              </div>
            )}

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Experience"
                  : "Add Experience"}
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
          <h5 className="mb-3">Experience List</h5>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Organization</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th width="190">Action</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(experiences) && experiences.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.certificate_image_url ? (
                        <img
                          src={item.certificate_image_url}
                          alt={item.role}
                          className="admin-experience-img"
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>

                    <td>
                      <strong>{item.organization}</strong>
                      <br />
                      <small className="text-muted">
                        {item.description?.slice(0, 70)}...
                      </small>
                    </td>

                    <td>{item.role}</td>

                    <td>
                      {item.start_date
                        ? item.start_date.slice(0, 10)
                        : "N/A"}{" "}
                      -{" "}
                      {item.is_current
                        ? "Present"
                        : item.end_date
                        ? item.end_date.slice(0, 10)
                        : "N/A"}
                    </td>

                    <td>
                      {item.is_current ? (
                        <span className="badge bg-success">Current</span>
                      ) : (
                        <span className="badge bg-secondary">Completed</span>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {experiences.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No experience found.
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

export default ExperienceAdmin;
