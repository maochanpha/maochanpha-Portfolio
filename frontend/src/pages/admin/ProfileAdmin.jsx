import { useEffect, useState } from "react";
import api from "../../api/axios";

function ProfileAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cvName, setCvName] = useState("");

  const [form, setForm] = useState({
    name: "",
    title: "",
    short_bio: "",
    about: "",
    career_goal: "",
    email: "",
    phone: "",
    location: "",
    github_url: "",
    linkedin_url: "",
    facebook_url: "",
    telegram_url: "",
    instagram_url: "",
    profile_photo: null,
    cv_file: null,
  });

  const getProfile = async () => {
    try {
      const response = await api.get("/admin/profile");

      if (response.data) {
        setForm({
          name: response.data.name || "",
          title: response.data.title || "",
          short_bio: response.data.short_bio || "",
          about: response.data.about || "",
          career_goal: response.data.career_goal || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          location: response.data.location || "",
          github_url: response.data.github_url || "",
          linkedin_url: response.data.linkedin_url || "",
          facebook_url: response.data.facebook_url || "",
          telegram_url: response.data.telegram_url || "",
          instagram_url: response.data.instagram_url || "",
          profile_photo: null,
          cv_file: null,
        });

        setPhotoPreview(response.data.profile_photo_url || null);

        if (response.data.cv_url) {
          setCvName("Current CV uploaded");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setForm({
        ...form,
        [name]: file,
      });

      if (name === "profile_photo" && file) {
        setPhotoPreview(URL.createObjectURL(file));
      }

      if (name === "cv_file" && file) {
        setCvName(file.name);
      }

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("title", form.title);
    formData.append("short_bio", form.short_bio);
    formData.append("about", form.about);
    formData.append("career_goal", form.career_goal);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("location", form.location);
    formData.append("github_url", form.github_url);
    formData.append("linkedin_url", form.linkedin_url);
    formData.append("facebook_url", form.facebook_url);
    formData.append("telegram_url", form.telegram_url);
    formData.append("instagram_url", form.instagram_url);

    if (form.profile_photo) {
      formData.append("profile_photo", form.profile_photo);
    }

    if (form.cv_file) {
      formData.append("cv_file", form.cv_file);
    }

    try {
      await api.post("/admin/profile", formData);

      setMessage("Profile updated successfully.");
      getProfile();
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

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h3 className="fw-bold">Profile Settings</h3>
      <p className="text-muted">
        Update your personal information, profile photo, CV, and social links.
      </p>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h5 className="mb-3">Basic Information</h5>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Example: Full-Stack Web Developer"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Short Bio</label>
                <textarea
                  name="short_bio"
                  className="form-control"
                  rows="3"
                  placeholder="Short introduction for home page"
                  value={form.short_bio}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">About</label>
                <textarea
                  name="about"
                  className="form-control"
                  rows="4"
                  placeholder="About yourself"
                  value={form.about}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Career Goal</label>
                <textarea
                  name="career_goal"
                  className="form-control"
                  rows="4"
                  placeholder="Your career goal"
                  value={form.career_goal}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <hr />

            <h5 className="mb-3">Files</h5>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Profile Photo</label>
                <input
                  type="file"
                  name="profile_photo"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                />

                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Profile Preview"
                    className="admin-profile-preview mt-3"
                  />
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">CV File</label>
                <input
                  type="file"
                  name="cv_file"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                />

                {cvName && (
                  <p className="text-muted mt-2 mb-0">
                    CV: {cvName}
                  </p>
                )}
              </div>
            </div>

            <hr />

            <h5 className="mb-3">Contact Information</h5>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="your-email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="+855..."
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Phnom Penh, Cambodia"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr />

            <h5 className="mb-3">Social Links</h5>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">GitHub URL</label>
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
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin_url"
                  className="form-control"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedin_url}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Facebook URL</label>
                <input
                  type="url"
                  name="facebook_url"
                  className="form-control"
                  placeholder="https://facebook.com/..."
                  value={form.facebook_url}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Telegram URL</label>
                <input
                  type="url"
                  name="telegram_url"
                  className="form-control"
                  placeholder="https://t.me/..."
                  value={form.telegram_url}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Instagram URL</label>
                <input
                  type="url"
                  name="instagram_url"
                  className="form-control"
                  placeholder="https://instagram.com/..."
                  value={form.instagram_url}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileAdmin;
