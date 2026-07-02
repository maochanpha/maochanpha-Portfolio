import { useEffect, useState } from "react";
import api from "../api/axios";

function Designs() {
  const [uxProjects, setUxProjects] = useState([]);
  const [posterProjects, setPosterProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDesigns = async () => {
    try {
      const uxResponse = await api.get("/ux-ui-projects");
      const posterResponse = await api.get("/poster-projects");

      setUxProjects(uxResponse.data);
      setPosterProjects(posterResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDesigns();
  }, []);

  if (loading) {
    return <div className="container py-5">Loading designs...</div>;
  }

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title">
          <h2>Design Projects</h2>
          <p>UX/UI and poster design works</p>
        </div>

        <h4 className="mb-3">UX/UI Projects</h4>

        <div className="row g-4 mb-5">
          {uxProjects.map((project) => (
            <div className="col-md-4" key={project.id}>
              <div className="card design-card h-100">
                {project.image_urls && project.image_urls.length > 0 ? (
                  <img
                    src={project.image_urls[0]}
                    alt={project.title}
                    className="card-img-top design-img"
                  />
                ) : (
                  <div className="design-img-placeholder">UX/UI Image</div>
                )}

                <div className="card-body">
                  <span className="badge bg-primary mb-2">
                    {project.category || "UX/UI"}
                  </span>

                  <h5>{project.title}</h5>

                  <p className="text-muted small">
                    {project.description}
                  </p>

                  {project.figma_url && (
                    <a
                      href={project.figma_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Figma
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h4 className="mb-3">Poster Design Projects</h4>

        <div className="row g-4">
          {posterProjects.map((project) => (
            <div className="col-md-4" key={project.id}>
              <div className="card design-card h-100">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="card-img-top poster-img"
                  />
                ) : (
                  <div className="design-img-placeholder">Poster Image</div>
                )}

                <div className="card-body">
                  <span className="badge bg-primary mb-2">
                    {project.category || "Poster"}
                  </span>

                  <h5>{project.title}</h5>

                  <p className="text-muted small">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Designs;