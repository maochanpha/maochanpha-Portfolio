import { useEffect, useState } from "react";
import api from "../../api/axios";

function PosterAdmin() {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    tools: "",
    category: "",
    image: null,
  });

  const getPosters = async () => {
    try {
      const response = await api.get("/admin/poster-projects");

      console.log("Poster API response:", response.data);

      if (Array.isArray(response.data)) {
        setPosters(response.data);
      } else if (Array.isArray(response.data.data)) {
        setPosters(response.data.data);
      } else {
        setPosters([]);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load poster projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosters();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setPreview(null);

    setForm({
      title: "",
      description: "",
      tools: "",
      category: "",
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setForm({
        ...form,
        image: file,
      });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("tools", form.tools);
    formData.append("category", form.category);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editingId) {
        formData.append("_method", "PUT");

        await api.post(`/admin/poster-projects/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Poster project updated successfully.");
      } else {
        await api.post("/admin/poster-projects", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Poster project created successfully.");
      }

      resetForm();
      getPosters();
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

  const handleEdit = (poster) => {
    setEditingId(poster.id);

    setForm({
      title: poster.title || "",
      description: poster.description || "",
      tools: Array.isArray(poster.tools) ? poster.tools.join(", ") : "",
      category: poster.category || "",
      image: null,
    });

    setPreview(poster.image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this poster project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/admin/poster-projects/${id}`);

      setMessage("Poster project deleted successfully.");
      getPosters();
    } catch (error) {
      console.log(error);
      alert("Failed to delete poster project.");
    }
  };

  if (loading) {
    return <p>Loading poster projects...</p>;
  }

  return (
    <div>
      <h3 className="fw-bold">Poster Projects Management</h3>
      <p className="text-muted">
        Add, edit, and delete your poster design projects.
      </p>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            {editingId ? "Edit Poster Project" : "Add New Poster Project"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Poster Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Example: Graduation Poster"
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
                  placeholder="Example: Social Media"
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
                  placeholder="Write poster description..."
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Tools Used</label>
                <input
                  type="text"
                  name="tools"
                  className="form-control"
                  placeholder="Photoshop, Canva, Illustrator"
                  value={form.tools}
                  onChange={handleChange}
                />
                <small className="text-muted">
                  Separate tools with comma.
                </small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Poster Image</label>
                <input
                  type="file"
                  name="image"
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
                  className="admin-poster-preview"
                />
              </div>
            )}

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Poster"
                  : "Add Poster"}
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
          <h5 className="mb-3">Poster Project List</h5>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Tools</th>
                  <th width="190">Action</th>
                </tr>
              </thead>

              <tbody>
                {posters.map((poster) => (
                  <tr key={poster.id}>
                    <td>
                      {poster.image_url ? (
                        <img
                          src={poster.image_url}
                          alt={poster.title}
                          className="admin-poster-img"
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>

                    <td>
                      <strong>{poster.title}</strong>
                      <br />
                      <small className="text-muted">
                        {poster.description?.slice(0, 70)}...
                      </small>
                    </td>

                    <td>{poster.category || "N/A"}</td>

                    <td>
                      {Array.isArray(poster.tools) &&
                        poster.tools.map((tool, index) => (
                          <span
                            className="badge bg-light text-dark me-1 mb-1"
                            key={index}
                          >
                            {tool}
                          </span>
                        ))}
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(poster)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(poster.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {posters.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No poster projects found.
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

export default PosterAdmin;