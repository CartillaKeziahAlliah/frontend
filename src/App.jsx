// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Sample, AnotherExample } from "./pages/admin/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sample />} />
        <Route path="/anotherExample" element={<AnotherExample />} />
      </Routes>
    </Router>
  );
}

export default App;
