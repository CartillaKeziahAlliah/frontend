import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import LandingPage from "./pages/landingPage";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import ProtectedRoute from "./Privateroute";
import { AnotherExample } from "./pages/admin/index";
import CourseDetail from "./components/students/CourseDetail";
import Dashboard from "./components/dashboard";
import UpdateProfile from "./components/UpdateProfile";
import SectionDetail from "./components/teacher/SectionsDetails";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Auth" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/anotherExample" element={<AnotherExample />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/updateprofile" element={<UpdateProfile />} />
            <Route path="/course/:subjectId" element={<CourseDetail />} />
            <Route path="/section/:sectionName" element={<SectionDetail />} />
          </Route>
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
