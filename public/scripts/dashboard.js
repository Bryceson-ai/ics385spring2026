const islandSelect = document.getElementById('island-select');

if (islandSelect) {
  const arrivalsContext = document.getElementById('arrivals-chart');
  const originsContext = document.getElementById('origins-chart');
  const trendContext = document.getElementById('trend-chart');

  let arrivalsChart;
  let originsChart;
  let trendChart;

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    return response.json();
  }

  function renderArrivalsChart(data) {
    arrivalsChart?.destroy();
    arrivalsChart = new Chart(arrivalsContext, {
      type: 'bar',
      data: {
        labels: data.map((row) => row.month),
        datasets: [
          {
            label: 'Monthly arrivals',
            data: data.map((row) => row.arrivals),
            backgroundColor: '#0f766e'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  function renderOriginsChart(data) {
    originsChart?.destroy();
    originsChart = new Chart(originsContext, {
      type: 'doughnut',
      data: {
        labels: ['US Domestic', 'Japan', 'Canada', 'Other International'],
        datasets: [
          {
            data: [data.usDomestic, data.japan, data.canada, data.otherInternational],
            backgroundColor: ['#0f766e', '#1d4ed8', '#d97706', '#7c3aed']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  function renderTrendChart(data) {
    trendChart?.destroy();
    trendChart = new Chart(trendContext, {
      type: 'line',
      data: {
        labels: data.map((row) => row.year),
        datasets: [
          {
            label: 'Average nights stayed',
            data: data.map((row) => row.avgStay),
            borderColor: '#c28a2c',
            backgroundColor: 'rgba(194, 138, 44, 0.18)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  function renderMetrics(metricsData, weatherData) {
    const avgStay = metricsData.stayDurations.reduce((sum, value) => sum + value, 0) / metricsData.stayDurations.length;
    document.getElementById('metric-adr').textContent = `$${metricsData.adr}`;
    document.getElementById('metric-occupancy').textContent = `${metricsData.occupancy}%`;
    document.getElementById('metric-stay').textContent = `${avgStay.toFixed(1)} nights`;

    const weatherTarget = document.getElementById('metric-weather');
    if (weatherData.error) {
      weatherTarget.textContent = 'Unavailable';
      return;
    }

    weatherTarget.textContent = `${Math.round(weatherData.temperatureF)}F / ${weatherData.temperatureC}C`;
  }

  async function loadDashboard(island) {
    const [arrivals, origins, metrics, weather, trends] = await Promise.all([
      fetchJson(`/api/arrivals?island=${encodeURIComponent(island)}`),
      fetchJson(`/api/origins?island=${encodeURIComponent(island)}`),
      fetchJson(`/api/metrics?island=${encodeURIComponent(island)}`),
      fetch(`/api/weather?island=${encodeURIComponent(island)}`).then((response) => response.ok ? response.json() : { error: true }),
      fetchJson(`/api/stay-trends?island=${encodeURIComponent(island)}`)
    ]);

    renderArrivalsChart(arrivals);
    renderOriginsChart(origins);
    renderTrendChart(trends);
    renderMetrics(metrics, weather);
  }

  islandSelect.addEventListener('change', (event) => {
    loadDashboard(event.target.value).catch((error) => {
      console.error(error);
    });
  });

  loadDashboard(islandSelect.value).catch((error) => {
    console.error(error);
  });
}
