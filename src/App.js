import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Drivers from './components/Drivers';
import Telemetry from './components/Telemetry';
import './index.css';

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    setIsDarkTheme(savedTheme);
    document.body.classList.toggle('dark-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.body.classList.toggle('dark-theme', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <Router>
      <div>
        <header>
          <h1>Formula 1 Telemetry Tool</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/drivers">Drivers</Link>
            <Link to="/telemetry">Telemetry</Link>
            <button className="theme-toggle-button" onClick={toggleTheme}>
              {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
            </button>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/telemetry" element={<Telemetry />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2024 Formula 1 Telemetry Tool. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
