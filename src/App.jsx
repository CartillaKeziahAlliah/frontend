import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AnotherExample } from "./pages/admin/index";
import Dashboard from "./pages/student/dashboard";
import Sidebar from "./components/sidebar";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-4">
          {" "}
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/anotherExample" element={<AnotherExample />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
