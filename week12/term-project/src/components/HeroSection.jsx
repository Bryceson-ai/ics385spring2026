function HeroSection({ propertyName, island, imageURL, tagline }) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${imageURL})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h2 className="hero-title">{propertyName}</h2>
          <p className="hero-subtitle">{island}, Hawai'i</p>
          <p className="hero-tagline">{tagline}</p>
          <button className="hero-cta-button">Explore Listings</button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
