export default function IslandCard({ name, nickname, segment, avgStay, img }) {
  return (
    <article className="island-card">
      <img src={img} alt={`${name} - ${nickname} island photo`} />
      <div className="card-content">
        <h2>{name}</h2>
        <p className="nickname">{nickname}</p>
        <p className="segment-badge">{segment}</p>
        <p className="stay-text">Average stay: {avgStay} days</p>
      </div>
    </article>
  );
}
