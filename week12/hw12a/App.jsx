import Header from "./Header";
import IslandCard from "./IslandCard";
import "./styles.css";

const islands = [
	{
		id: 1,
		name: "Hawaii",
		description:
			"The Big Island is known for active volcanoes, black-sand beaches, and dramatic lava landscapes.",
		tip: "Pack layers if you plan to visit Mauna Kea because the summit gets cold quickly.",
	},
	{
		id: 2,
		name: "Maui",
		description:
			"Maui blends resort beaches, lush rainforest drives, and the sunrise views from Haleakala.",
		tip: "Start the Road to Hana early so you can enjoy the stops before traffic builds up.",
	},
	{
		id: 3,
		name: "Oahu",
		description:
			"Oahu combines city life in Honolulu with famous surf spots, hiking trails, and historic sites.",
		tip: "Reserve popular attractions like Pearl Harbor ahead of time during busy travel periods.",
	},
];

function App() {
	return (
		<main className="app-shell">
			<Header />
			<section className="cards-grid" aria-label="Hawaiian island cards">
				{islands.map((island) => (
					<IslandCard
						key={island.id}
						name={island.name}
						description={island.description}
						tip={island.tip}
					/>
				))}
			</section>
		</main>
	);
}

export default App;
