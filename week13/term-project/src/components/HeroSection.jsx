function HeroSection({ propertyName, island, imageURL, tagline, onViewDashboard }) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${imageURL})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h2 className="hero-title">{propertyName}</h2>
          <p className="hero-subtitle">{island}, Hawai'i</p>
          <p className="hero-tagline">{tagline}</p>
          <button type="button" className="hero-cta-button" onClick={onViewDashboard}>
            View Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
