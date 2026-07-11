import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";

const links = [
  ["Home", "home"], ["About", "about"], ["Skills", "skills"],
  ["Projects", "projects"], ["UX/UI", "ux-ui"], ["Education", "education"],
  ["Experience", "experience"], ["Contact", "contact"],
];

function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const location = useLocation();

  useEffect(() => setIsOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    api.get("/profile")
      .then((response) => setCvUrl(response.data?.cv_url || ""))
      .catch(() => setCvUrl(""));
  }, []);

  return (
    <nav className="navbar navbar-expand-xl landing-navbar sticky-top" aria-label="Main navigation">
      <div className="container">
        <Link className="navbar-brand" to="/#home">Mao<span>.</span></Link>
        <button className="navbar-toggler" type="button" aria-controls="navbarMenu" aria-expanded={isOpen} aria-label={isOpen ? "Close menu" : "Open menu"} onClick={() => setIsOpen((open) => !open)}>
          <span className={`menu-icon ${isOpen ? "is-open" : ""}`} aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
        <div className={`navbar-collapse ${isOpen ? "is-open" : ""}`} id="navbarMenu">
          <ul className="navbar-nav ms-auto align-items-xl-center">
            {links.map(([label, id]) => <li className="nav-item" key={id}><Link className="nav-link" to={`/#${id}`}>{label}</Link></li>)}
          </ul>
          {cvUrl ? (
            <a className="nav-cv" href={cvUrl} target="_blank" rel="noreferrer">Download CV <span></span></a>
          ) : (
            <Link className="nav-cv" to="/#contact">Contact Me <span>↗</span></Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
