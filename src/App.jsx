// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AnotherExample } from "./pages/admin/index";
import Dashboard from "./pages/student/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/anotherExample" element={<AnotherExample />} />
      </Routes>
    </Router>
  );
}

export default App;
