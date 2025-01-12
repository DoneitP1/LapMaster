import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Drivers from './components/Drivers';
import Telemetry from './components/Telemetry';
import RaceResults from './RaceResults';
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
          <h1>Lap Master</h1>
          <nav>
            {[
              { path: '/', label: 'Home' },
              { path: '/drivers', label: 'Drivers' },
              { path: '/telemetry', label: 'Telemetry' },
              { path: '/race-results', label: 'Race Results' },
            ].map((link, index) => (
              <Link key={index} to={link.path}>
                {link.label}
              </Link>
            ))}
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
            <Route path="/race-results" element={<RaceResults />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2024 Lap Master. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
