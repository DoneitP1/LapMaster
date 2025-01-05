import React, { useEffect, useState } from 'react';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API çağrısı
    fetch('http://127.0.0.1:5000/api/drivers/2023/Bahrain')
      .then((response) => response.json())
      .then((data) => {
        setDrivers(data.drivers); // Gelen veriyi state'e kaydet
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching drivers:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading drivers...</p>;

  return (
    <div>
      <h2>Drivers</h2>
      <ul>
        {drivers.map((driver, index) => (
          <li key={index}>
            {driver.name} ({driver.code})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Drivers;
