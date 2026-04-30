// Example: App.jsx passing hardcoded data to components
import HeroSection from './components/HeroSection';
import AmenitiesSection from './components/AmenitiesSection';
import CTASection from './components/CTASection';
const property = {
name: "Wailea Beach Retreat",
island: "Maui",
tagline: "Your romantic escape on the Valley Isle.",
imageURL: "/images/wailea-hero.jpg",
amenities: ["Ocean View Lanai", "Infinity Pool", "Couples Spa", "Farm-to-Table Dining"],
contactEmail: "reservations@wailearetreat.com",
};
function App() {
return (
<div className="app">
<HeroSection name={property.name} island={property.island}
tagline={property.tagline} imageURL={property.imageURL} />
<AmenitiesSection amenities={property.amenities} />
<CTASection email={property.contactEmail} />
</div>
);
}
export default App;