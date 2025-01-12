import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Geliştirilmiş Giriş Banner'ı */}
      <div className="home-banner">
        <div className="banner-content">
          <h1>Welcome to Lap Master</h1>
          <p>Explore time telemetry, post-race analysis, and driver comparisons!</p>
        </div>
      </div>

      {/* Yönlendirme Kartları */}
      <div className="home-navigation">
        <div className="nav-card" onClick={() => navigate('/drivers')}>
          <h3>Drivers</h3>
          <p>View detailed profiles of all drivers.</p>
        </div>
        <div className="nav-card" onClick={() => navigate('/telemetry')}>
          <h3>Telemetry</h3>
          <p>Analyse real-time and post-race telemetry data.</p>
        </div>
        <div className="nav-card" onClick={() => navigate('/race-results')}>
          <h3>Race Results</h3>
          <p>See race results and compare performances.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
