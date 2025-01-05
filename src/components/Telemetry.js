import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const Telemetry = () => {
  const [year, setYear] = useState(2023);
  const [race, setRace] = useState('Bahrain');
  const [driver, setDriver] = useState('HAM');
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTelemetry = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:5000/api/telemetry/${year}/${race}/${driver}`)
      .then((response) => response.json())
      .then((data) => {
        setTelemetry(data.telemetry);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching telemetry:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTelemetry();
  };

  const chartData = telemetry
    ? {
        labels: telemetry.time,
        datasets: [
          {
            label: 'Speed (km/h)',
            data: telemetry.speed,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            tension: 0.4,
          }
        ]
      }
    : null;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Telemetry Data for ${driver} (${year} - ${race})` }
    },
    scales: {
      x: { title: { display: true, text: 'Time (s)' } },
      y: { title: { display: true, text: 'Speed (km/h)' } }
    }
  };

  return (
    <div>
      <h2>Telemetry Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Year:</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>

        <div>
          <label>Race:</label>
          <input type="text" value={race} onChange={(e) => setRace(e.target.value)} />
        </div>

        <div>
          <label>Driver Code:</label>
          <input type="text" value={driver} onChange={(e) => setDriver(e.target.value)} />
        </div>

        <button type="submit">Get Telemetry</button>
      </form>

      {loading && <p>Loading telemetry data...</p>}
      {telemetry && <Line key={`${year}-${race}-${driver}`} data={chartData} options={options} />}
    </div>
  );
};

export default Telemetry;
