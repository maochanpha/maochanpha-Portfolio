import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

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
          ".section-title, .project-card, .skill-card, .design-card, .timeline-card, .about-image-wrapper, .about-card, .contact-card",
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
  }, [location.pathname]);

  return (
    <>
      <PublicNavbar />

      <main>
        <Outlet />
      </main>

      <footer className="footer-section">
        <div className="container text-center">
          <p className="mb-0">
            © {new Date().getFullYear()} My Portfolio. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default PublicLayout;
