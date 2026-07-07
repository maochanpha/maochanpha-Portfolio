import { useEffect, useState } from "react";
import api from "../api/axios";

function About() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const response = await api.get("/profile");
      setProfile(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return <div className="container py-5">Loading about...</div>;
  }

  return (
    <section className="section-padding about-section">
      <div className="container">
        <div className="section-title">
          <h2>About Me</h2>
          <p>My background and career goal</p>
        </div>

        <div className="row g-5 align-items-center">
          <div className="col-lg-5 text-center">
            <div className="about-image-wrapper">
              {profile?.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt={profile.name}
                  className="about-image"
                />
              ) : (
                <div className="about-placeholder">Profile Image</div>
              )}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm about-card">
              <div className="card-body p-4 p-lg-5">
                <p className="text-primary fw-bold mb-2">About Me</p>

                <h3 className="fw-bold mb-2">
                  {profile?.name || "Your Name"}
                </h3>

                <p className="text-primary fw-semibold mb-4">
                  {profile?.title || "Web Developer & Designer"}
                </p>

                <h5 className="fw-bold">Introduction</h5>
                <p className="text-muted about-text">
                  {profile?.about ||
                    "I am a Computer Science student and web developer. I enjoy building clean, responsive, and useful websites."}
                </p>

                <h5 className="fw-bold mt-4">Career Goal</h5>
                <p className="text-muted about-text mb-0">
                  {profile?.career_goal ||
                    "My goal is to become a strong full-stack developer who can build real-world web applications."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;