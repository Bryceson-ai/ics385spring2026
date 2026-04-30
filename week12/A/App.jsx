import { useMemo, useState } from "react";
import Header from "./Header";
import IslandCard from "./IslandCard";
import "./styles.css";

const islands = [
  {
    id: 1,
    name: "Hawaii",
    nickname: "The Big Island",
    vibe: "Adventure",
    nightlyRate: 245,
    beaches: 14,
    description:
      "The Big Island is known for active volcanoes, black-sand beaches, and dramatic lava landscapes.",
    tip: "Pack layers if you plan to visit Mauna Kea because the summit gets cold quickly.",
  },
  {
    id: 2,
    name: "Maui",
    nickname: "The Valley Isle",
    vibe: "Relaxation",
    nightlyRate: 310,
    beaches: 18,
    description:
      "Maui blends resort beaches, lush rainforest drives, and sunrise views from Haleakala.",
    tip: "Start the Road to Hana early so you can enjoy the stops before traffic builds up.",
  },
  {
    id: 3,
    name: "Oahu",
    nickname: "The Gathering Place",
    vibe: "City + Surf",
    nightlyRate: 280,
    beaches: 12,
    description:
      "Oahu combines city life in Honolulu with famous surf spots, hiking trails, and historic sites.",
    tip: "Reserve popular attractions like Pearl Harbor ahead of time during busy travel periods.",
  },
  {
    id: 4,
    name: "Kauai",
    nickname: "The Garden Isle",
    vibe: "Nature",
    nightlyRate: 295,
    beaches: 16,
    description:
      "Kauai offers towering cliffs, lush valleys, and scenic drives along the Na Pali Coast.",
    tip: "Book canyon and coast tours early because weather shifts can limit same-day options.",
  },
  {
    id: 5,
    name: "Lanai",
    nickname: "The Pineapple Isle",
    vibe: "Luxury",
    nightlyRate: 360,
    beaches: 8,
    description:
      "Lanai is quieter and upscale, with remote beaches and uncrowded luxury experiences.",
    tip: "Plan transportation in advance because rideshare options are limited on the island.",
  },
  {
    id: 6,
    name: "Molokai",
    nickname: "The Friendly Isle",
    vibe: "Culture",
    nightlyRate: 220,
    beaches: 10,
    description:
      "Molokai emphasizes local culture, calm coastlines, and slower-paced island travel.",
    tip: "Respect local community spaces and check business hours before driving long distances.",
  },
];

const vibeOptions = ["All", "Adventure", "Relaxation", "City + Surf", "Nature", "Luxury", "Culture"];

function App() {
  const [selectedVibe, setSelectedVibe] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const filteredIslands = useMemo(
    () =>
      islands.filter(
        (island) => selectedVibe === "All" || island.vibe === selectedVibe
      ),
    [selectedVibe]
  );

  const sortedIslands = useMemo(() => {
    return [...filteredIslands].sort((a, b) => {
      if (sortBy === "rate-low") {
        return a.nightlyRate - b.nightlyRate;
      }

      if (sortBy === "rate-high") {
        return b.nightlyRate - a.nightlyRate;
      }

      if (sortBy === "beaches") {
        return b.beaches - a.beaches;
      }

      return a.name.localeCompare(b.name);
    });
  }, [filteredIslands, sortBy]);

  const stats = filteredIslands.reduce(
    (accumulator, island) => {
      accumulator.count += 1;
      accumulator.totalRate += island.nightlyRate;
      accumulator.totalBeaches += island.beaches;
      return accumulator;
    },
    { count: 0, totalRate: 0, totalBeaches: 0 }
  );

  const averageRate = stats.count > 0 ? Math.round(stats.totalRate / stats.count) : 0;

  return (
    <main className="app-shell">
      <Header totalCount={islands.length} filteredCount={filteredIslands.length} />

      <section className="toolbar" aria-label="Island controls">
        <label className="control">
          <span>Filter by vibe</span>
          <select
            value={selectedVibe}
            onChange={(event) => setSelectedVibe(event.target.value)}
          >
            {vibeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="control">
          <span>Sort cards</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="name">Name (A-Z)</option>
            <option value="rate-low">Nightly rate (Low-High)</option>
            <option value="rate-high">Nightly rate (High-Low)</option>
            <option value="beaches">Beach count (Most first)</option>
          </select>
        </label>
      </section>

      <section className="summary" aria-label="Island summary statistics">
        <p><strong>{stats.count}</strong> islands shown</p>
        <p><strong>${averageRate}</strong> average nightly rate</p>
        <p><strong>{stats.totalBeaches}</strong> combined top beaches</p>
      </section>

      <section className="cards-grid" aria-label="Hawaiian island cards">
        {sortedIslands.map((island) => (
          <IslandCard
            key={island.id}
            name={island.name}
            nickname={island.nickname}
            vibe={island.vibe}
            nightlyRate={island.nightlyRate}
            beaches={island.beaches}
            description={island.description}
            tip={island.tip}
          />
        ))}
      </section>
    </main>
  );
}

export default App;

