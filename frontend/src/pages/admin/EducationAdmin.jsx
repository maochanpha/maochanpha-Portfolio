import { useEffect, useState } from "react";
import api from "../../api/axios";

function EducationAdmin() {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        institution: "",
        degree: "",
        major: "",
        start_year: "",
        end_year: "",
        is_current: false,
        description: "",
    });

    const getEducation = async () => {
        try {
            const response = await api.get("/admin/education");

            if (Array.isArray(response.data)) {
                setEducation(response.data);
            } else if (Array.isArray(response.data.data)) {
                setEducation(response.data.data);
            } else {
                setEducation([]);
            }
        } catch (error) {
            console.log(error);
            alert("Failed to load education.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEducation();
    }, []);

    const resetForm = () => {
        setEditingId(null);

        setForm({
            institution: "",
            degree: "",
            major: "",
            start_year: "",
            end_year: "",
            is_current: false,
            description: "",
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");

        const payload = {
            institution: form.institution,
            degree: form.degree,
            major: form.major,
            start_year: form.start_year || null,
            end_year: form.is_current ? null : form.end_year || null,
            is_current: form.is_current,
            description: form.description,
        };

        try {
            if (editingId) {
                await api.put(`/admin/education/${editingId}`, payload);
                setMessage("Education updated successfully.");
            } else {
                await api.post("/admin/education", payload);
                setMessage("Education created successfully.");
            }

            resetForm();
            getEducation();
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
            institution: item.institution || "",
            degree: item.degree || "",
            major: item.major || "",
            start_year: item.start_year || "",
            end_year: item.end_year || "",
            is_current: item.is_current || false,
            description: item.description || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this education?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/admin/education/${id}`);

            setMessage("Education deleted successfully.");
            getEducation();
        } catch (error) {
            console.log(error);
            alert("Failed to delete education.");
        }
    };

    if (loading) {
        return <p>Loading education...</p>;
    }

    return (
        <div>
            <h3 className="fw-bold">Education Management</h3>
            <p className="text-muted">
                Add, edit, and delete your education background.
            </p>

            {message && <div className="alert alert-success">{message}</div>}

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="mb-3">
                        {editingId ? "Edit Education" : "Add New Education"}
                    </h5>

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">School / University</label>
                                <input type="text"
                                    name="institution"
                                    className="form-control"
                                    placeholder="Example: Western University"
                                    value={form.institution}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Degree</label>
                                <input
                                    type="text"
                                    name="degree"
                                    className="form-control"
                                    placeholder="Example: Bachelor Degree"
                                    value={form.degree}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Major</label>
                                <input
                                    type="text"
                                    name="major"
                                    className="form-control"
                                    placeholder="Example: Computer Science"
                                    value={form.major}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Start Year</label>
                                <input
                                    type="number"
                                    name="start_year"
                                    className="form-control"
                                    placeholder="2022"
                                    value={form.start_year}
                                    onChange={handleChange}
                                    min="1900"
                                    max="2100"
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">End Year</label>
                                <input
                                    type="number"
                                    name="end_year"
                                    className="form-control"
                                    placeholder="2026"
                                    value={form.end_year}
                                    onChange={handleChange}
                                    min="1900"
                                    max="2100"
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
                                        id="isCurrentEducation"
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="isCurrentEducation"
                                    >
                                        I am currently studying here
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
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" disabled={saving}>
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Education"
                                        : "Add Education"}
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
                    <h5 className="mb-3">Education List</h5>

                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Institution</th>
                                    <th>Degree / Major</th>
                                    <th>Year</th>
                                    <th>Status</th>
                                    <th width="190">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {education.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <strong>{item.institution}</strong>
                                            <br />
                                            <small className="text-muted">
                                                {item.description?.slice(0, 70)}...
                                            </small>
                                        </td>

                                        <td>
                                            {item.degree || "N/A"}
                                            <br />
                                            <small className="text-muted">
                                                {item.major || "N/A"}
                                            </small>
                                        </td>

                                        <td>
                                            {item.start_year || "N/A"} -{" "}
                                            {item.is_current ? "Present" : item.end_year || "N/A"}
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

                                {education.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">
                                            No education found.
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

export default EducationAdmin;