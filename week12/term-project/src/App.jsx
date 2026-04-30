import "./styles.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import About from "./components/About";
import Amenities from "./components/Amenities";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

function App() {
  // Hardcoded property data (Week 12) — Option (a) from assignment
  const property = {
    id: "1",
    name: "Kihei Studio by the Sea",
    island: "Maui",
    type: "vacation rental",
    description:
      "Cozy Airbnb studio steps from Kamaole Beach, perfect for Canadian visitors escaping winter and exploring South Maui at a great value.",
    amenities: ["wifi", "kitchen", "beach access", "parking", "air conditioning"],
    targetSegment: "Canadian vacationers",
    imageURL: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop",
    contactEmail: "stay@kihei-studio.example.com",
  };

  return (
    <div className="app">
      <Header />
      <HeroSection
        propertyName={property.name}
        island={property.island}
        imageURL={property.imageURL}
        tagline="Your Maui escape awaits — affordable, local, unforgettable."
      />
      <About
        description={property.description}
        targetSegment={property.targetSegment}
      />
      <Amenities amenitiesList={property.amenities} />
      <CTASection
        propertyName={property.name}
        contactEmail={property.contactEmail}
      />
      <Footer />
    </div>
  );
}

export default App;
