import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

function PublicLayout() {
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