function IslandCard({
  name,
  nickname,
  vibe,
  nightlyRate,
  beaches,
  description,
  tip,
}) {
  return (
    <article className="island-card">
      <p className="card-label">{nickname}</p>
      <h2>{name}</h2>
      <p className="card-meta">{vibe} • ${nightlyRate}/night • {beaches} beaches</p>
      <p className="card-description">{description}</p>
      <p className="card-tip">
        <span>Visitor tip:</span> {tip}
      </p>
    </article>
  );
}

export default IslandCard;

