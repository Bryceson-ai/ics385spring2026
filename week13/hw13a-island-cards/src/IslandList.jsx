import { useState } from "react";
import IslandCard from "./IslandCard";

export default function IslandList({ islands }) {
  const [segment, setSegment] = useState("All");

  const displayed =
    segment === "All" ? islands : islands.filter((island) => island.segment === segment);

  const segments = ["All", ...new Set(islands.map((island) => island.segment))];

  const avgStay = displayed.length
    ? (
        displayed.reduce((sum, island) => sum + island.avgStay, 0) / displayed.length
      ).toFixed(1)
    : 0;

  return (
    <section>
      <div className="controls">
        <label htmlFor="segment-filter">Visitor segment</label>
        <select
          id="segment-filter"
          value={segment}
          onChange={(event) => setSegment(event.target.value)}
        >
          {segments.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="grid">
        {displayed.map((island) => (
          <IslandCard key={island.id} {...island} />
        ))}
      </div>

      <article className="summary-card" aria-live="polite">
        <h2>Summary</h2>
        <p>
          Showing <strong>{displayed.length}</strong> island cards.
        </p>
        <p>
          Average stay: <strong>{avgStay}</strong> days
        </p>
      </article>
    </section>
  );
}
