import "./App.css";
import IslandList from "./IslandList";

const islands = [
  {
    id: 1,
    name: "Maui",
    nickname: "Valley Isle",
    segment: "Honeymoon",
    avgStay: 6.2,
    img: "https://picsum.photos/300/200?random=1",
  },
  {
    id: 2,
    name: "O'ahu",
    nickname: "Gathering Place",
    segment: "First-time",
    avgStay: 4.8,
    img: "https://picsum.photos/300/200?random=2",
  },
  {
    id: 3,
    name: "Kaua'i",
    nickname: "Garden Isle",
    segment: "Eco-tourist",
    avgStay: 7.1,
    img: "https://picsum.photos/300/200?random=3",
  },
  {
    id: 4,
    name: "Hawai'i",
    nickname: "Big Island",
    segment: "Adventure",
    avgStay: 8.3,
    img: "https://picsum.photos/300/200?random=4",
  },
  {
    id: 5,
    name: "Lana'i",
    nickname: "Pineapple Isle",
    segment: "Luxury",
    avgStay: 5.6,
    img: "https://picsum.photos/300/200?random=5",
  },
];

export default function App() {
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Week 13 - Data-Driven React</p>
        <h1>Hawaii Island Cards</h1>
        <p className="intro">
          Filter island cards by visitor segment and compute live summary stats with reduce.
        </p>
      </header>

      <IslandList islands={islands} />
    </main>
  );
}
