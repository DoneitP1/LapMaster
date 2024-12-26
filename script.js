async function fetchTelemetryData() {
  try {
    const response = await fetch('http://localhost:8000/api/telemetry');
    const data = await response.json();
    drawChart(data.labels, data.values);
  } catch (error) {
    console.error('Error fetching telemetry data:', error);
  }
}

function drawChart(labels, values) {
  const ctx = document.getElementById('telemetryChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Speed (km/h)',
          data: values,
          borderColor: 'rgba(255, 69, 0, 1)',
          backgroundColor: 'rgba(255, 69, 0, 0.2)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', fetchTelemetryData);

