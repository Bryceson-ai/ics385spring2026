import { useState } from "react";
import ArrivalChart from "./charts/ArrivalChart";
import OriginChart from "./charts/OriginChart";
import TrendChart from "./charts/TrendChart";
import MetricCards from "./components/MetricCards";
import WeatherWidget from "./components/WeatherWidget";

function Dashboard({ propertyName, defaultIsland, islandOptions, cityMap, onBack }) {
  const [selectedIsland, setSelectedIsland] = useState(defaultIsland);

  return (
    <main className="dashboard">
      <div className="dashboard-container">
        <section className="dashboard-header">
          <div className="dashboard-panel">
            <span className="dashboard-kicker">Visitor Dashboard</span>
            <h2 className="dashboard-title">{propertyName} Performance Snapshot</h2>
            <p className="dashboard-copy">
              Compare tourism demand, visitor mix, and stay patterns across nearby
              islands while preparing this dashboard for Week 14 admin protection.
            </p>

            <div className="dashboard-controls">
              <div className="dashboard-control">
                <label htmlFor="island-select">Select island</label>
                <select
                  id="island-select"
                  value={selectedIsland}
                  onChange={(event) => setSelectedIsland(event.target.value)}
                >
                  {islandOptions.map((island) => (
                    <option key={island} value={island}>
                      {island}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" className="dashboard-back" onClick={onBack}>
                Back to Marketing Page
              </button>
            </div>

            <div className="dashboard-summary">
              <p>Primary property island: {defaultIsland}</p>
              <p>Selected city for weather: {cityMap[selectedIsland]}</p>
            </div>
          </div>

          <WeatherWidget city={cityMap[selectedIsland]} />
        </section>

        <MetricCards island={selectedIsland} />

        <section className="charts-grid" aria-label="Dashboard charts">
          <ArrivalChart island={selectedIsland} />
          <OriginChart island={selectedIsland} />
          <TrendChart island={selectedIsland} />
        </section>

        <p className="dashboard-note">
          Charts and KPI cards now fetch island data from the Express analytics API.
        </p>
      </div>
    </main>
  );
}

export default Dashboard;