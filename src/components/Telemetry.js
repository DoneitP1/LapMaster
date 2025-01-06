import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import '../index.css';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const sessionTypes = [
  { value: 'R', label: 'Race' },
  { value: 'Q', label: 'Qualifying' },
  { value: 'FP1', label: 'Practice 1' },
  { value: 'FP2', label: 'Practice 2' },
  { value: 'FP3', label: 'Practice 3' }
];

const Telemetry = () => {
  const [year, setYear] = useState(2023);
  const [round, setRound] = useState('');
  const [sessionType, setSessionType] = useState('R');
  const [driver, setDriver] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [races, setRaces] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(false);

  // Yarış listesini çekmek için API çağrısı
  useEffect(() => {
    if (year) {
      fetch(`http://127.0.0.1:5000/api/races/${year}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.races) {
            setRaces(data.races);
          } else {
            console.error('No races found');
          }
        })
        .catch((error) => console.error('Error fetching races:', error));
    }
  }, [year]);

  // Sürücü listesini çekmek için API çağrısı
  useEffect(() => {
    if (year && round && sessionType) {
      fetch(`http://127.0.0.1:5000/api/drivers/${year}/${round}/${sessionType}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.drivers) {
            setDrivers(data.drivers);
          } else {
            console.error('No drivers found');
          }
        })
        .catch((error) => console.error('Error fetching drivers:', error));
    }
  }, [year, round, sessionType]);

  const fetchTelemetry = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:5000/api/telemetry/${year}/${round}/${driver}`)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTelemetry();
  };

  const createChartData = (label, data, borderColor, backgroundColor) => ({
    labels: telemetry.time,
    datasets: [
      {
        label,
        data,
        borderColor,
        backgroundColor,
        tension: 0.4,
      }
    ]
  });

  const options = (title) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title }
    },
    scales: {
      x: { title: { display: true, text: 'Time (s)' } },
      y: { title: { display: true, text: title }, beginAtZero: true }
    }
  });

  return (
    <div>
      <h2>Telemetry Data</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>
        </div>

        <div>
          <label>Race:</label>
          <select value={round} onChange={(e) => setRound(e.target.value)}>
            <option value="">Select a race</option>
            {races.length > 0 ? (
              races.map((race) => (
                <option key={race.round} value={race.round}>
                  {race.name}
                </option>
              ))
            ) : (
              <option disabled>No races available</option>
            )}
          </select>
        </div>

        <div>
          <label>Session Type:</label>
          <select value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
            {sessionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Driver:</label>
          <select value={driver} onChange={(e) => setDriver(e.target.value)}>
            <option value="">Select a driver</option>
            {drivers.length > 0 ? (
              drivers.map((driver, index) => (
                <option key={index} value={driver.code}>
                  {driver.name} ({driver.code})
                </option>
              ))
            ) : (
              <option disabled>No drivers available</option>
            )}
          </select>
        </div>

        <button type="submit" disabled={!year || !round || !driver}>
          Get Telemetry
        </button>
      </form>

      {loading && <p>Loading telemetry data...</p>}

      {telemetry && (
        <>
          <div className="chart-container">
            <h3>Speed (km/h)</h3>
            <Line data={createChartData('Speed (km/h)', telemetry.speed, 'rgba(75,192,192,1)', 'rgba(75,192,192,0.2)')} options={options('Speed (km/h)')} />
          </div>

          <div className="chart-container">
            <h3>RPM</h3>
            <Line data={createChartData('RPM', telemetry.rpm, 'rgba(255,99,132,1)', 'rgba(255,99,132,0.2)')} options={options('RPM')} />
          </div>

          <div className="chart-container">
            <h3>Throttle (%)</h3>
            <Line data={createChartData('Throttle (%)', telemetry.throttle, 'rgba(54,162,235,1)', 'rgba(54,162,235,0.2)')} options={options('Throttle (%)')} />
          </div>

          <div className="chart-container">
            <h3>Brake (%)</h3>
            <Line data={createChartData('Brake (%)', telemetry.brake, 'rgba(255,206,86,1)', 'rgba(255,206,86,0.2)')} options={options('Brake (%)')} />
          </div>

          <div className="chart-container">
            <h3>Gear</h3>
            <Line data={createChartData('Gear', telemetry.gear, 'rgba(153,102,255,1)', 'rgba(153,102,255,0.2)')} options={options('Gear')} />
          </div>
        </>
      )}
    </div>
  );
};

export default Telemetry;
