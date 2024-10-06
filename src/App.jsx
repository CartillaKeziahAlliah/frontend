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
  );
}

export default App;
