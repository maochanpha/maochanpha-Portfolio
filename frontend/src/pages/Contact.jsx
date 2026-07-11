import { useEffect, useState } from "react";
import api from "../api/axios";

function Contact() {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const getProfile = async () => {
    try {
      const response = await api.get("/profile");
      setProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await api.post("/contact-messages", form);

      setSuccess("Message sent successfully.");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setError("Failed to send message. Please check your form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title">
          <h2>Contact Me</h2>
          <p>Send me a message or connect with me</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h4>Contact Information</h4>

                <p className="text-muted">
                  Feel free to contact me for work, internship, collaboration, or project discussion.
                </p>

                <p><strong>Email:</strong> {profile?.email || "your-email@example.com"}</p>
                <p><strong>Phone:</strong> {profile?.phone || "+855 00 000 000"}</p>
                <p><strong>Location:</strong> {profile?.location || "Phnom Penh, Cambodia"}</p>

                <div className="d-flex gap-2 flex-wrap mt-3">
                  {profile?.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm">
                      GitHub
                    </a>
                  )}

                  {profile?.facebook_url && (
                    <a href={profile.facebook_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                      Facebook
                    </a>
                  )}

                  {profile?.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="btn btn-info btn-sm text-white">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows="5"
                      value={form.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
