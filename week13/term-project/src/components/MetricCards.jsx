import { useEffect, useState } from "react";

function formatStayNights(stayDurations) {
  if (!stayDurations.length) {
    return "0.0 nights";
  }

  const totalNights = stayDurations.reduce((sum, value) => sum + value, 0);
  const averageNights = totalNights / stayDurations.length;
  return `${averageNights.toFixed(1)} nights`;
}

function MetricCards({ island }) {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMetrics() {
      setMetrics(null);
      setError("");

      try {
        const response = await fetch(`/api/metrics?island=${encodeURIComponent(island)}`);
        if (!response.ok) {
          throw new Error("Unable to load metrics");
        }
        const row = await response.json();

        if (!ignore) {
          setMetrics(row ?? null);
        }
      } catch {
        if (!ignore) {
          setError("Metrics API unavailable. Start the Express server on port 3000.");
        }
      }
    }

    loadMetrics();

    return () => {
      ignore = true;
    };
  }, [island]);

  if (!metrics) {
    return <section className="metric-grid" aria-label="Loading metrics"><div className="metric-card"><p>{error || "Loading KPIs..."}</p></div></section>;
  }

  const metricItems = [
    {
      label: "Average Daily Rate",
      icon: "💵",
      value: `$${metrics.adr} / night`,
      subtext: "Estimated from lodging market data",
    },
    {
      label: "Occupancy Rate",
      icon: "🏨",
      value: `${metrics.occupancy}%`,
      subtext: "Average occupied room nights",
    },
    {
      label: "Average Length of Stay",
      icon: "🧳",
      value: formatStayNights(metrics.stayDurations),
      subtext: "Computed with Array.reduce()",
    },
  ];

  return (
    <section className="metric-grid" aria-label="Key performance indicators">
      {metricItems.map((metric) => (
        <article key={metric.label} className="metric-card">
          <div className="metric-label">
            <span className="metric-icon" aria-hidden="true">{metric.icon}</span>
            <span>{metric.label}</span>
          </div>
          <p className="metric-value">{metric.value}</p>
          <p className="metric-subtext">{metric.subtext}</p>
        </article>
      ))}
    </section>
  );
}

export default MetricCards;