function CTASection({ propertyName, contactEmail, onViewDashboard }) {
  return (
    <section className="cta">
      <div className="cta-container">
        <h2>Ready to Book Your Maui Escape?</h2>
        <p>
          <strong>{propertyName}</strong> is waiting for you. Reach out today to
          secure your island getaway.
        </p>
        <div className="cta-buttons">
          <a
            href={`mailto:${contactEmail}`}
            className="cta-button primary"
          >
            Contact Us
          </a>
          <button type="button" className="cta-button secondary" onClick={onViewDashboard}>
            View Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
