import Tables from "./components/Tables";
import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AnotherExample } from "./pages/admin/index";
import Dashboard from "./pages/student/dashboard";
import AdminRoute from "./PrivateRoute";
import LandingPage from "./pages/landingPage";
import AuthPage from "./pages/AuthPage";
import "./App.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Auth" element={<AuthPage />} />
        <Route element={<AdminRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/anotherExample" element={<AnotherExample />} />
          <Route path="/table" element={<Tables />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
