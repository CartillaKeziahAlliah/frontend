import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import LandingPage from "./pages/landingPage";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import ProtectedRoute from "./PrivateRoute";
import Dashboard from "./pages/student/dashboard";
import { AnotherExample } from "./pages/admin/index";
import TablePages from "./components/TablePages";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/anotherExample" element={<AnotherExample />} />
            <Route path="/table" element={<TablePages />} />
            <Route path="/Dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
