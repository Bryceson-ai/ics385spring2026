function IslandCard({ name, description, tip }) {
  return (
    <article className="island-card">
      <p className="card-label">Island</p>
      <h2>{name}</h2>
      <p className="card-description">{description}</p>
      <p className="card-tip">
        <span>Visitor tip:</span> {tip}
      </p>
    </article>
  );
}

export default IslandCard;
