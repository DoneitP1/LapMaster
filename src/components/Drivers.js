import React, { useEffect, useState } from 'react';
import '../index.css';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sürücü listesini çekmek için API çağrısı
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/drivers/2023/1/R') // Örnek: 2023 yılının ilk yarışındaki sürücüler
      .then((response) => response.json())
      .then((data) => {
        setDrivers(data.drivers);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching drivers:', error);
        setLoading(false);
      });
  }, []);

  // Seçilen sürücü profili için API çağrısı
  const handleDriverClick = (driverCode) => {
    fetch(`http://127.0.0.1:5000/api/drivers/profile/${driverCode}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedDriver(data);
      })
      .catch((error) => console.error('Error fetching driver profile:', error));
  };

  if (loading) return <p>Loading drivers...</p>;

  return (
    <div>
      <h2>Drivers</h2>
      <ul className="driver-list">
        {drivers.map((driver, index) => (
          <li
            key={index}
            onClick={() => handleDriverClick(driver.code)}
            className="driver-item"
          >
            {driver.name} ({driver.code})
          </li>
        ))}
      </ul>

      {selectedDriver && (
        <div className="driver-profile">
          <img
            src={selectedDriver.photo_url}
            alt={selectedDriver.name}
            className="driver-photo"
          />
          <h3>{selectedDriver.name}</h3>
          <p>
            <strong>Team:</strong> {selectedDriver.team}
          </p>
          <p>
            <strong>Wins:</strong> {selectedDriver.wins}
          </p>
          <p>
            <strong>Poles:</strong> {selectedDriver.poles}
          </p>
          <p>
            <strong>Championships:</strong> {selectedDriver.championships}
          </p>
        </div>
      )}
    </div>
  );
};

export default Drivers;
