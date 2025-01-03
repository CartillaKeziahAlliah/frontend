import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import LandingPage from "./pages/landingPage";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import ProtectedRoute from "./Privateroute";
import { MainPage } from "./pages/admin/index";
import CourseDetail from "./components/students/CourseDetail";
import Dashboard from "./components/dashboard";
import UpdateProfile from "./components/UpdateProfile";
import SectionDetail from "./components/teacher/SectionsDetails";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Auth" element={<AuthPage />} />
          <Route path="/ContactUs" element={<ContactUs />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/updateprofile" element={<UpdateProfile />} />
            <Route path="/course/:subjectId" element={<CourseDetail />} />
            <Route path="/section/:sectionName" element={<SectionDetail />} />
            <Route path="/admin" element={<MainPage />} />
          </Route>
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
