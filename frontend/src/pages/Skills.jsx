import { useEffect, useState } from "react";
import api from "../api/axios";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSkills = async () => {
    try {
      const response = await api.get("/skills");
      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setSkills(list);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  const categories = [
    ...new Set(
      (Array.isArray(skills) ? skills : []).map((skill) => skill.category),
    ),
  ];

  if (loading) {
    return <div className="container py-5">Loading skills...</div>;
  }

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title">
          <h2>My Skills</h2>
          <p>Technical skills and design tools</p>
        </div>

        {Array.isArray(categories) && categories.map((category) => (
          <div className="mb-5" key={category}>
            <h4 className="mb-3">{category}</h4>

            <div className="row g-4">
              {Array.isArray(skills) && skills
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <div className="col-md-4" key={skill.id}>
                    <div className="card skill-card h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          {skill.icon_url ? (
                            <img
                              src={skill.icon_url}
                              alt={skill.name}
                              className="skill-icon"
                            />
                          ) : (
                            <div className="skill-icon-placeholder">
                              {skill.name.charAt(0)}
                            </div>
                          )}

                          <div>
                            <h5 className="mb-0">{skill.name}</h5>
                            <small className="text-muted">{skill.category}</small>
                          </div>
                        </div>

                        <div className="progress">
                          <div
                            className="progress-bar"
                            style={{ width: `${skill.level}%` }}
                          >
                            {skill.level}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
