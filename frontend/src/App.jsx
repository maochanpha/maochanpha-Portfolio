import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Designs from "./pages/Designs";
import EducationExperience from "./pages/EducationExperience";
import Contact from "./pages/Contact";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import SkillsAdmin from "./pages/admin/SkillsAdmin";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import UxUiAdmin from "./pages/admin/UxUiAdmin";
import PosterAdmin from "./pages/admin/PosterAdmin";
import EducationAdmin from "./pages/admin/EducationAdmin";
import ExperienceAdmin from "./pages/admin/ExperienceAdmin";
import MessagesAdmin from "./pages/admin/MessageAdmin";
import ProfileAdmin from "./pages/admin/ProfileAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/designs" element={<Designs />} />
          <Route path="/education-experience" element={<EducationExperience />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="ux-ui-projects" element={<UxUiAdmin />} />
          <Route path="poster-projects" element={<PosterAdmin />} />
          <Route path="education" element={<EducationAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="profile" element={<ProfileAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;