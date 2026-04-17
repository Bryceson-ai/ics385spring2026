import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./chartSetup";

function ArrivalChart({ island }) {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadArrivals() {
      setChartData(null);
      setError("");

      try {
        const response = await fetch(`/api/arrivals?island=${encodeURIComponent(island)}`);
        if (!response.ok) {
          throw new Error("Unable to load arrivals");
        }
        const rows = await response.json();

        if (!ignore) {
          setChartData({
            labels: rows.map((row) => row.month),
            datasets: [
              {
                label: `${island} visitor arrivals`,
                data: rows.map((row) => row.arrivals),
                backgroundColor: "rgba(13, 110, 122, 0.72)",
                borderRadius: 8,
              },
            ],
          });
        }
      } catch {
        if (!ignore) {
          setError("Arrivals API unavailable. Start the Express server on port 3000.");
        }
      }
    }

    loadArrivals();

    return () => {
      ignore = true;
    };
  }, [island]);

  if (!chartData) {
    return <div className="chart-card"><div className="chart-loading">{error || "Loading arrivals..."}</div></div>;
  }

  return (
    <article className="chart-card">
      <h3>Visitor Arrivals</h3>
      <p className="chart-meta">Monthly arrivals for {island} from the Express analytics API.</p>
      <div className="chart-shell">
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
          }}
        />
      </div>
    </article>
  );
}

export default ArrivalChart;