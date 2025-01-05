import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Drivers from './components/Drivers';
import Telemetry from './components/Telemetry';

function App() {
  return (
    <Router>
      <div>
        <header>
          <h1>Formula 1 Telemetry Tool</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/drivers">Drivers</a>
            <a href="/telemetry">Telemetry</a>
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
