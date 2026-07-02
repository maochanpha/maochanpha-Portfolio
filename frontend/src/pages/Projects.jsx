import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const getProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  if (loading) {
    return <div className="container py-5">Loading projects...</div>;
  }

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title">
          <h2>Web Projects</h2>
          <p>My development projects</p>
        </div>

        <div className="text-center mb-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`btn btn-sm me-2 mb-2 ${
                selectedCategory === category ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {filteredProjects.map((project) => (
            <div className="col-md-4" key={project.id}>
              <div className="card project-card h-100">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="card-img-top project-img"
                  />
                ) : (
                  <div className="project-img-placeholder">Project Image</div>
                )}

                <div className="card-body">
                  <span className="badge bg-primary mb-2">
                    {project.category || "Project"}
                  </span>

                  <h5>{project.title}</h5>

                  <p className="text-muted small">
                    {project.description?.slice(0, 120)}...
                  </p>

                  <div className="mb-3">
                    {Array.isArray(project.technologies) &&
                      project.technologies.map((tech, index) => (
                        <span className="badge bg-light text-dark me-1" key={index}>
                          {tech}
                        </span>
                      ))}
                  </div>

                  <Link to={`/projects/${project.slug}`} className="btn btn-outline-primary btn-sm">
                    View Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-muted mt-4">No projects found.</p>
        )}
      </div>
    </section>
  );
}

export default Projects;