import { useEffect, useState } from "react";
import api from "../api/axios";

function EducationExperience() {
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  const getData = async () => {
    try {
      const educationResponse = await api.get("/education");
      const experienceResponse = await api.get("/experience");

      const educationList = Array.isArray(educationResponse.data)
        ? educationResponse.data
        : Array.isArray(educationResponse.data?.data)
          ? educationResponse.data.data
          : [];
      const experienceList = Array.isArray(experienceResponse.data)
        ? experienceResponse.data
        : Array.isArray(experienceResponse.data?.data)
          ? experienceResponse.data.data
          : [];

      setEducation(educationList);
      setExperience(experienceList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title">
          <h2>Education & Experience</h2>
          <p>My study background and volunteer experience</p>
        </div>

        <div className="row g-5">
          <div className="col-lg-6">
            <h4 className="mb-4">Education</h4>

            {Array.isArray(education) && education.map((item) => (
              <div className="timeline-card" key={item.id}>
                <h5>{item.institution}</h5>

                <p className="text-primary mb-1">
                  {item.degree} {item.major && `- ${item.major}`}
                </p>

                <small className="text-muted">
                  {item.start_year} - {item.is_current ? "Present" : item.end_year}
                </small>

                <p className="text-muted mt-2">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="col-lg-6">
            <h4 className="mb-4">Experience / Volunteer</h4>

            {Array.isArray(experience) && experience.map((item) => (
              <div className="timeline-card" key={item.id}>
                <h5>{item.organization}</h5>

                <p className="text-primary mb-1">{item.role}</p>

                <small className="text-muted">
                  {item.start_date} - {item.is_current ? "Present" : item.end_date}
                </small>

                <p className="text-muted mt-2">{item.description}</p>

                {item.certificate_image_url && (
                  <img
                    src={item.certificate_image_url}
                    alt={item.role}
                    className="certificate-img"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EducationExperience;
