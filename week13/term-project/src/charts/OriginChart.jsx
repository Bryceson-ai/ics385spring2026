import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "./chartSetup";

function OriginChart({ island }) {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadOrigins() {
      setChartData(null);
      setError("");

      try {
        const response = await fetch(`/api/origins?island=${encodeURIComponent(island)}`);
        if (!response.ok) {
          throw new Error("Unable to load origin mix");
        }
        const row = await response.json();

        if (!ignore) {
          setChartData({
            labels: ["U.S. domestic", "Japan", "Canada", "Other international"],
            datasets: [
              {
                label: `${island} visitor origin share`,
                data: [row.usDomestic, row.japan, row.canada, row.otherInternational],
                backgroundColor: ["#0b7285", "#48bfe3", "#f4a261", "#90be6d"],
                borderColor: "#ffffff",
                borderWidth: 2,
              },
            ],
          });
        }
      } catch {
        if (!ignore) {
          setError("Origin API unavailable. Start the Express server on port 3000.");
        }
      }
    }

    loadOrigins();

    return () => {
      ignore = true;
    };
  }, [island]);

  if (!chartData) {
    return <div className="chart-card"><div className="chart-loading">{error || "Loading visitor origin..."}</div></div>;
  }

  return (
    <article className="chart-card">
      <h3>Visitor Origin Mix</h3>
      <p className="chart-meta">Share of visitors for {island} from the Express analytics API.</p>
      <div className="chart-shell">
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          }}
        />
      </div>
    </article>
  );
}

export default OriginChart;