import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./chartSetup";

function TrendChart({ island }) {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadTrend() {
      setChartData(null);
      setError("");

      try {
        const response = await fetch(`/api/stay-trends?island=${encodeURIComponent(island)}`);
        if (!response.ok) {
          throw new Error("Unable to load stay trends");
        }
        const rows = await response.json();

        if (!ignore) {
          setChartData({
            labels: rows.map((row) => row.year),
            datasets: [
              {
                label: `${island} avg stay (nights)`,
                data: rows.map((row) => row.avgStay),
                borderColor: "#f4a261",
                backgroundColor: "rgba(244, 162, 97, 0.18)",
                tension: 0.35,
                fill: true,
              },
            ],
          });
        }
      } catch {
        if (!ignore) {
          setError("Stay-trend API unavailable. Start the Express server on port 3000.");
        }
      }
    }

    loadTrend();

    return () => {
      ignore = true;
    };
  }, [island]);

  if (!chartData) {
    return <div className="chart-card chart-wide"><div className="chart-loading">{error || "Loading stay trend..."}</div></div>;
  }

  return (
    <article className="chart-card chart-wide">
      <h3>Average Length of Stay Trend</h3>
      <p className="chart-meta">Post-COVID stay trend for {island}, useful for pricing and minimum-night decisions.</p>
      <div className="chart-shell">
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
              },
            },
          }}
        />
      </div>
    </article>
  );
}

export default TrendChart;