import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top" aria-label="Main navigation">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          My Portfolio
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarMenu"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className={`menu-icon ${isOpen ? "is-open" : ""}`} aria-hidden="true">
            <span></span><span></span><span></span>
          </span>
        </button>

        <div className={`navbar-collapse ${isOpen ? "is-open" : ""}`} id="navbarMenu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeMenu}>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={closeMenu}>
                About
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/skills" onClick={closeMenu}>
                Skills
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/projects" onClick={closeMenu}>
                Projects
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/designs" onClick={closeMenu}>
                Designs
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/education-experience" onClick={closeMenu}>
                Education
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link btn btn-primary text-white px-3" to="/contact" onClick={closeMenu}>
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
