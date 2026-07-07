import { useEffect, useState } from "react";
import api from "../../api/axios";

function UxUiAdmin() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        tools: "",
        figma_url: "",
        category: "",
        images: [],
    });

    const getProjects = async () => {
        try {
            const response = await api.get("/admin/ux-ui-projects");

            console.log("UX/UI API response:", response.data);

            if (Array.isArray(response.data)) {
                setProjects(response.data);
            } else if (Array.isArray(response.data.data)) {
                setProjects(response.data.data);
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.log(error);
            alert("Failed to load UX/UI projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProjects();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setPreviews([]);

        setForm({
            title: "",
            description: "",
            tools: "",
            figma_url: "",
            category: "",
            images: [],
        });
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const selectedFiles = Array.from(files);

            setForm({
                ...form,
                images: selectedFiles,
            });

            const imagePreviews = selectedFiles.map((file) =>
                URL.createObjectURL(file)
            );

            setPreviews(imagePreviews);
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
        formData.append("figma_url", form.figma_url);
        formData.append("category", form.category);

        if (form.images.length > 0) {
            form.images.forEach((image) => {
                formData.append("images[]", image);
            });
        }

        try {
            if (editingId) {
                formData.append("_method", "PUT");

                await api.post(`/admin/ux-ui-projects/${editingId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                setMessage("UX/UI project updated successfully.");
            } else {
                await api.post("/admin/ux-ui-projects", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                setMessage("UX/UI project created successfully.");
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
            tools: Array.isArray(project.tools) ? project.tools.join(", ") : "",
            figma_url: project.figma_url || "",
            category: project.category || "",
            images: [],
        });

        setPreviews(project.image_urls || []);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this UX/UI project?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/admin/ux-ui-projects/${id}`);

            setMessage("UX/UI project deleted successfully.");
            getProjects();
        } catch (error) {
            console.log(error);
            alert("Failed to delete UX/UI project.");
        }
    };

    if (loading) {
        return <p>Loading UX/UI projects...</p>;
    }

    return (
        <div>
            <h3 className="fw-bold">UX/UI Projects Management</h3>
            <p className="text-muted">
                Add, edit, and delete your UX/UI design projects.
            </p>

            {message && <div className="alert alert-success">{message}</div>}

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="mb-3">
                        {editingId ? "Edit UX/UI Project" : "Add New UX/UI Project"}
                    </h5>

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Project Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="Example: Mobile Banking UI"
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
                                    placeholder="Example: Mobile App"
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
                                    placeholder="Write UX/UI project description..."
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
                                    placeholder="Figma, Canva, Photoshop"
                                    value={form.tools}
                                    onChange={handleChange}
                                />
                                <small className="text-muted">Separate tools with comma.</small>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Figma Link</label>
                                <input
                                    type="url"
                                    name="figma_url"
                                    className="form-control"
                                    placeholder="https://figma.com/..."
                                    value={form.figma_url}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label className="form-label">Mockup Images</label>
                                <input
                                    type="file"
                                    name="images"
                                    className="form-control"
                                    accept="image/*"
                                    multiple
                                    onChange={handleChange}
                                />
                                <small className="text-muted">
                                    You can choose more than one image.
                                </small>
                            </div>
                        </div>

                        {previews.length > 0 && (
                            <div className="mb-3">
                                <p className="mb-2">Preview:</p>

                                <div className="admin-preview-grid">
                                    {previews.map((preview, index) => (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt="Preview"
                                            className="admin-design-preview"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" disabled={saving}>
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update UX/UI Project"
                                        : "Add UX/UI Project"}
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
                    <h5 className="mb-3">UX/UI Project List</h5>

                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Tools</th>
                                    <th>Figma</th>
                                    <th width="190">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id}>
                                        <td>
                                            {project.image_urls && project.image_urls.length > 0 ? (
                                                <img
                                                    src={project.image_urls[0]}
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
                                            {Array.isArray(project.tools) &&
                                                project.tools.map((tool, index) => (
                                                    <span
                                                        className="badge bg-light text-dark me-1 mb-1"
                                                        key={index}
                                                    >
                                                        {tool}
                                                    </span>
                                                ))}
                                        </td>

                                        <td>
                                            {project.figma_url ? (
                                                <a
                                                    href={project.figma_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    Open
                                                </a>
                                            ) : (
                                                <span className="text-muted">No Link</span>
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
                                            No UX/UI projects found.
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

export default UxUiAdmin;