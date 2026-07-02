import { useEffect, useState } from "react";
import api from "../api/axios";

function About() {
  const [profile, setProfile] = useState(null);

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

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title">
          <h2>About Me</h2>
          <p>My background and career goal</p>
        </div>

        <div className="row g-4 align-items-center">
          <div className="col-lg-5 text-center">
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

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h3>{profile?.name || "Your Name"}</h3>

                <p className="text-primary fw-bold">
                  {profile?.title || "Web Developer & Designer"}
                </p>

                <h5>Introduction</h5>
                <p className="text-muted">
                  {profile?.about ||
                    "I am a Computer Science student and web developer. I enjoy building clean, responsive, and useful websites."}
                </p>

                <h5>Career Goal</h5>
                <p className="text-muted">
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