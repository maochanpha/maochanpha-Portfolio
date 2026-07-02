import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function ProjectDetail() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProject = async () => {
    try {
      const response = await api.get(`/projects/${slug}`);
      setProject(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProject();
  }, [slug]);

  if (loading) {
    return <div className="container py-5">Loading project detail...</div>;
  }

  if (!project) {
    return (
      <div className="container py-5">
        <h3>Project not found</h3>
        <Link to="/projects">Back to projects</Link>
      </div>
    );
  }

  return (
    <section className="section-padding">
      <div className="container">
        <Link to="/projects" className="btn btn-outline-primary btn-sm mb-4">
          ← Back to Projects
        </Link>

        <div className="row g-4">
          <div className="col-lg-7">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="project-detail-img"
              />
            ) : (
              <div className="project-detail-placeholder">Project Image</div>
            )}
          </div>

          <div className="col-lg-5">
            <span className="badge bg-primary mb-3">
              {project.category || "Project"}
            </span>

            <h2>{project.title}</h2>

            <p className="text-muted">{project.description}</p>

            <h5>Technologies</h5>

            <div className="mb-4">
              {Array.isArray(project.technologies) &&
                project.technologies.map((tech, index) => (
                  <span className="badge bg-light text-dark me-1 mb-1" key={index}>
                    {tech}
                  </span>
                ))}
            </div>

            <div className="d-flex gap-2 flex-wrap">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark"
                >
                  GitHub
                </a>
              )}

              {project.live_demo_url && (
                <a
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectDetail;