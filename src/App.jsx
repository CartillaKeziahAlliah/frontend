<<<<<<< HEAD
import { useState } from 'react';
import Tables from './components/Tables';
import './App.css';
import './index.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Tables />
    </div>
=======
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
>>>>>>> 8b97168a7f53eded53715478c8fb8487d548c5a6
  );
}

export default App;
