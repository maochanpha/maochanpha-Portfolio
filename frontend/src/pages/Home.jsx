import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const asList = (response) =>
  Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.data?.data)
      ? response.data.data
      : [];

function Home() {
  const [data, setData] = useState({
    profile: null,
    projects: [],
    skills: [],
    uxProjects: [],
    education: [],
    experience: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const [profile, projects, skills, uxProjects, education, experience] =
          await Promise.all([
            api.get("/profile"),
            api.get("/projects"),
            api.get("/skills"),
            api.get("/ux-ui-projects"),
            api.get("/education"),
            api.get("/experience"),
          ]);

        setData({
          profile: profile.data,
          projects: asList(projects),
          skills: asList(skills),
          uxProjects: asList(uxProjects),
          education: asList(education),
          experience: asList(experience),
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const { profile, projects, skills, uxProjects, education, experience } = data;
  const name = profile?.name || "Mao ChanPha";
  const skillGroups = [...new Set(skills.map((skill) => skill.category).filter(Boolean))];

  useEffect(() => {
    if (!loading && window.location.hash) {
      window.setTimeout(() => {
        document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [loading]);

  if (loading) {
    return <div className="site-loader">Loading portfolio…</div>;
  }

  return (
    <div className="landing-page">
      <section className="landing-hero" id="home">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span></span> Available for opportunities</p>
              <h1>Hi, I’m <em>{name}</em>.</h1>
              <h2>{profile?.title || "Full-Stack Developer & UI Enthusiast"}</h2>
              <p className="hero-lead">
                {profile?.short_bio || "I build thoughtful, responsive digital experiences with modern web technologies and clean design."}
              </p>
              <div className="hero-cta">
                <a href="#projects" className="btn btn-accent">View My Work <span></span></a>
                <a href="#contact" className="btn btn-dark-soft">Contact Me</a>
                {profile?.cv_url && <a href={profile.cv_url} target="_blank" rel="noreferrer" className="btn btn-link-dark">Download CV <span></span></a>}
              </div>
              <div className="landing-socials" aria-label="Social links">
                {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a>}
                {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>}
                {profile?.telegram_url && <a href={profile.telegram_url} target="_blank" rel="noreferrer">Telegram</a>}
                {profile?.facebook_url && <a href={profile.facebook_url} target="_blank" rel="noreferrer">Facebook</a>}
              </div>
            </div>

            <div className="hero-portrait-wrap">
              <div className="portrait-accent"></div>
              {profile?.profile_photo_url ? (
                <img className="landing-portrait" src={profile.profile_photo_url} alt={name} />
              ) : (
                <div className="landing-portrait portrait-fallback">MC</div>
              )}
              <div className="portrait-note"><span>✦</span> Building useful things<br /><strong>with code & creativity</strong></div>
            </div>
          </div>

          <div className="hero-metrics">
            <div><strong>{projects.length}+</strong><span>Projects</span></div>
            <div><strong>{skills.length}+</strong><span>Skills</span></div>
            <div><strong>Always</strong><span>Learning</span></div>
            <div><strong>100%</strong><span>Passion</span></div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="about">
        <div className="container about-layout">
          <div className="section-heading"><p>01 — About</p><h2>A little about me.</h2></div>
          <div className="about-statement reveal-card">
            <p>{profile?.about || "I’m a Computer Science student and developer focused on creating clean, useful, and accessible web experiences."}</p>
            <p>{profile?.career_goal || "My goal is to grow as a full-stack developer and turn thoughtful ideas into dependable real-world products."}</p>
            <a href="#contact">Let’s work together <span>→</span></a>
          </div>
        </div>
      </section>

      <section className="landing-section section-tint" id="skills">
        <div className="container">
          <div className="section-heading centered"><p>02 — Expertise</p><h2>Skills & tools.</h2><span>Technologies I use to bring ideas to life.</span></div>
          <div className="skill-groups">
            {skillGroups.map((category) => (
              <article className="skill-group reveal-card" key={category}>
                <div className="skill-group-icon">{category.charAt(0)}</div>
                <h3>{category}</h3>
                <div className="skill-tags">
                  {skills.filter((skill) => skill.category === category).map((skill) => <span key={skill.id}>{skill.name}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="projects">
        <div className="container">
          <div className="section-heading heading-row"><div><p>03 — Selected work</p><h2>Featured projects.</h2></div><Link to="/projects">View all projects →</Link></div>
          <div className="landing-project-grid">
            {projects.slice(0, 6).map((project) => (
              <article className="work-card reveal-card" key={project.id}>
                {project.image_url ? <img src={project.image_url} alt={project.title} /> : <div className="work-placeholder">Project preview</div>}
                <div className="work-body">
                  <div><span className="work-category">{project.category || "Web Development"}</span><h3>{project.title}</h3></div>
                  <p>{project.description?.slice(0, 125)}</p>
                  <div className="tech-list">{project.technologies?.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <Link to={`/projects/${project.slug}`} className="work-link">View project <span>↗</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section section-dark" id="ux-ui">
        <div className="container">
          <div className="section-heading light heading-row"><div><p>04 — Design work</p><h2>UX/UI projects.</h2></div><Link to="/designs">Explore designs →</Link></div>
          <div className="design-strip">
            {uxProjects.slice(0, 6).map((project) => (
              <article className="ui-card reveal-card" key={project.id}>
                {project.image_urls?.[0] ? <img src={project.image_urls[0]} alt={project.title} /> : <div className="ui-placeholder">UI Design</div>}
                <div><span>{project.category || "UX/UI"}</span><h3>{project.title}</h3><p>{project.tools?.join(" · ")}</p>{project.figma_url && <a href={project.figma_url} target="_blank" rel="noreferrer">Open in Figma ↗</a>}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="journey">
        <div className="container journey-grid">
          <div id="education">
            <div className="section-heading"><p>05 — Education</p><h2>My learning journey.</h2></div>
            <div className="warm-timeline">
              {education.map((item) => <article className="journey-item reveal-card" key={item.id}><span className="timeline-dot"></span><small>{item.start_year} — {item.is_current ? "Present" : item.end_year}</small><h3>{item.institution}</h3><strong>{item.degree}{item.major ? ` · ${item.major}` : ""}</strong><p>{item.description}</p></article>)}
            </div>
          </div>
          <div id="experience">
            <div className="section-heading"><p>06 — Experience</p><h2>Where I’ve contributed.</h2></div>
            <div className="warm-timeline">
              {experience.map((item) => <article className="journey-item reveal-card" key={item.id}><span className="timeline-dot"></span><small>{item.start_date} — {item.is_current ? "Present" : item.end_date}</small><h3>{item.role}</h3><strong>{item.organization}</strong><p>{item.description}</p></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section contact-section" id="contact">
        <div className="container contact-panel reveal-card">
          <div><p className="eyebrow"><span></span> Get in touch</p><h2>Have a project in mind?<br /><em>Let’s talk.</em></h2><p>I’m open to internships, collaborations, and interesting development projects.</p></div>
          <div className="contact-methods">
            <a href={`mailto:${profile?.email || ""}`}><small>Email</small><strong>{profile?.email || "Let’s connect"}</strong><span></span></a>
            <a href={profile?.telegram_url || `tel:${profile?.phone || ""}`}><small>Phone / Telegram</small><strong>{profile?.phone || "Message me"}</strong><span></span></a>
            <div><small>Location</small><strong>{profile?.location || "Phnom Penh, Cambodia"}</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
