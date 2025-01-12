import React, { useState, useEffect } from 'react';

function RaceResults() {
  const [year, setYear] = useState(2023); // Varsayılan yıl
  const [raceList, setRaceList] = useState([]); // Yarış listesini tutan state
  const [selectedRound, setSelectedRound] = useState(''); // Seçilen round numarası
  const [results, setResults] = useState(null); // Yarış sonuçlarını tutan state

  // Yarış listesini çekmek için useEffect
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/races/${year}`);
        const data = await response.json();
        setRaceList(data.races); // Yarış listesini state'e kaydet
        setSelectedRound(''); // Yeni yıl seçildiğinde round sıfırlansın
      } catch (error) {
        console.error('Error fetching race list:', error);
      }
    };

    fetchRaces();
  }, [year]); // Yıl değiştiğinde yeniden çalışır

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRound) return; // Eğer round seçilmediyse istek gönderme

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/results/${year}/${selectedRound}`);
      const data = await response.json();
      setResults(data.results); // API'den gelen sonuçları state'e kaydet
    } catch (error) {
      console.error('Error fetching race results:', error);
    }
  };

  return (
    <div className="race-results-container">
      <h2>Race Results</h2>
      <form onSubmit={handleSubmit} className="race-results-form">
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
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            disabled={!raceList.length}
          >
            <option value="">Select a race</option>
            {raceList.map((race) => (
              <option key={race.round} value={race.round}>
                {race.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={!selectedRound}>
          Get Race Results
        </button>
      </form>

      {/* Sonuçları Göster */}
      {results ? (
        <div className="results-table">
          <h3>Results for {year}, Round {selectedRound}</h3>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Driver</th>
                <th>Team</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.Position}</td>
                  <td>{result.FullName}</td>
                  <td>{result.TeamName}</td>
                  <td>{result.Points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Please select a year and race to see the results.</p>
      )}
    </div>
  );
}

export default RaceResults;
