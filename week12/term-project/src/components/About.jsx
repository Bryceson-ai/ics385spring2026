function About({ description, targetSegment }) {
  return (
    <section className="about">
      <div className="about-container">
        <h2>About This Property</h2>
        <p className="about-text">{description}</p>
        <p className="about-segment">
          <strong>Perfect for:</strong> {targetSegment}
        </p>
        <div className="about-highlights">
          <div className="highlight">
            <h3>Local Experience</h3>
            <p>
              Authentic stays run by locals who know Maui inside and out.
            </p>
          </div>
          <div className="highlight">
            <h3>Affordable Luxury</h3>
            <p>
              Quality accommodations at prices that respect your travel budget.
            </p>
          </div>
          <div className="highlight">
            <h3>Island Spirit</h3>
            <p>
              Feel the aloha: breathtaking views, warm hospitality, and endless sunshine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
