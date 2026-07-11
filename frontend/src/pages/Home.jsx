import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const profileResponse = await api.get("/profile");
      const projectResponse = await api.get("/projects");
      const skillResponse = await api.get("/skills");

      setProfile(profileResponse.data);
      const projectList = Array.isArray(projectResponse.data)
        ? projectResponse.data
        : Array.isArray(projectResponse.data?.data)
          ? projectResponse.data.data
          : [];
      const skillList = Array.isArray(skillResponse.data)
        ? skillResponse.data
        : Array.isArray(skillResponse.data?.data)
          ? skillResponse.data.data
          : [];

      setProjects(projectList.slice(0, 3));
      setSkills(skillList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <div className="container py-5">Loading...</div>;
  }

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center hero-row">
            <div className="col-lg-7 hero-content">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                Available for Internship / Junior Developer
              </div>

              <p className="text-primary fw-bold mb-2">Hello, I am</p>

              <h1 className="hero-title">
                {profile?.name || "Your Name"}
              </h1>

              <h4 className="hero-subtitle">
                {profile?.title || "Full-Stack Web Developer"}
              </h4>

              <p className="hero-text">
                {profile?.short_bio ||
                  "I build clean and responsive websites using Laravel, React JS, MySQL, and modern UI design."}
              </p>

              <div className="hero-actions d-flex gap-3 flex-wrap mt-4">
                <Link to="/projects" className="btn btn-primary px-4">
                  View Projects
                </Link>

                {profile?.cv_url ? (
                  <a
                    href={profile.cv_url}
                    className="btn btn-outline-primary px-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download CV
                  </a>
                ) : (
                  <button className="btn btn-outline-primary px-4" disabled>
                    Download CV
                  </button>
                )}

                <Link to="/contact" className="btn btn-glass px-4">
                  Contact Me
                </Link>
              </div>

              <div className="hero-socials mt-4">
                {profile?.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}

                {profile?.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                )}

                {profile?.facebook_url && (
                  <a href={profile.facebook_url} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                )}

                {profile?.telegram_url && (
                  <a href={profile.telegram_url} target="_blank" rel="noreferrer">
                    Telegram
                  </a>
                )}
              </div>

              <div className="hero-stats mt-5">
                <div className="hero-stat-card">
                  <h3>{projects.length}+</h3>
                  <p>Featured Projects</p>
                </div>

                <div className="hero-stat-card">
                  <h3>{skills.length}+</h3>
                  <p>Technical Skills</p>
                </div>

                <div className="hero-stat-card">
                  <h3>Laravel</h3>
                  <p>Main Backend</p>
                </div>
              </div>
            </div>

            <div className="col-lg-5 text-center hero-visual">
              <div className="hero-image-wrapper">
                {profile?.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.name}
                    className="hero-image"
                  />
                ) : (
                  <div className="hero-placeholder">
                    <span>Profile Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-title">
            <h2>Featured Projects</h2>
            <p>Some projects from my portfolio</p>
          </div>

          <div className="row g-4">
            {Array.isArray(projects) && projects.map((project) => (
              <div className="col-md-4" key={project.id}>
                <div className="card project-card h-100">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="card-img-top project-img"
                    />
                  ) : (
                    <div className="project-img-placeholder">
                      Project Image
                    </div>
                  )}

                  <div className="card-body">
                    <span className="badge bg-primary mb-2">
                      {project.category || "Project"}
                    </span>

                    <h5>{project.title}</h5>

                    <p className="text-muted small">
                      {project.description?.slice(0, 100)}...
                    </p>

                    <Link
                      to={`/projects/${project.slug}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link className="btn btn-primary" to="/projects">
              See All Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
