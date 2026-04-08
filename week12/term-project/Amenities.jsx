function Amenities({ amenitiesList }) {
  const amenityIcons = {
    wifi: "📶",
    kitchen: "🍳",
    "beach access": "🏖️",
    parking: "🅿️",
    "air conditioning": "❄️",
    "ocean view": "🌊",
    garden: "🌺",
    hammock: "🪑",
    bbq: "🔥",
    "outdoor shower": "🚿",
    "surfboard storage": "🏄",
    patio: "🏡",
    "jungle view": "🌴",
    "outdoor deck": "🛋️",
    "snorkeling gear": "🤿",
    "beach chairs": "☀️",
  };

  return (
    <section className="amenities">
      <div className="amenities-container">
        <h2>What's Included</h2>
        <div className="amenities-grid">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="amenity-card">
              <span className="amenity-icon">
                {amenityIcons[amenity.toLowerCase()] || "✨"}
              </span>
              <p className="amenity-name">{amenity}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Amenities;
