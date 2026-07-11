import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    const scrollTarget = location.hash
      ? document.querySelector(location.hash)
      : null;

    if (scrollTarget) {
      window.setTimeout(() => scrollTarget.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );

    const prepareElements = () => {
      document
        .querySelectorAll(
          ".section-title, .section-heading, .project-card, .skill-card, .design-card, .timeline-card, .reveal-card, .about-image-wrapper, .about-card, .contact-card",
        )
        .forEach((element, index) => {
          if (!element.dataset.revealReady) {
            element.dataset.revealReady = "true";
            element.classList.add("reveal-item");
            element.style.setProperty(
              "--reveal-delay",
              `${Math.min(index % 3, 2) * 80}ms`,
            );
            observer.observe(element);
          }
        });
    };

    prepareElements();
    const mutationObserver = new MutationObserver(prepareElements);
    const main = document.querySelector("main");

    if (main) {
      mutationObserver.observe(main, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname, location.hash]);

  return (
    <>
      <PublicNavbar />

      <main>
        <Outlet />
      </main>

      <footer className="footer-section landing-footer">
        <div className="container footer-grid">
          <div className="footer-brand"><Link to="/#home">Mao<span>.</span></Link><p>Developer and designer building useful digital experiences.</p></div>
          <div><h3>Quick links</h3><Link to="/#about">About</Link><Link to="/#projects">Projects</Link><Link to="/#contact">Contact</Link></div>
          <div><h3>What I do</h3><span>Web Development</span><span>Responsive Design</span><span>UX/UI Design</span></div>
          <div><h3>Connect</h3><Link to="/contact">Email me</Link><Link to="/#contact">Social links</Link></div>
        </div>
        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} Mao ChanPha. All rights reserved.</p><a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}

export default PublicLayout;
