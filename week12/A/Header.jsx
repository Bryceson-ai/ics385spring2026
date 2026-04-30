function Header({ totalCount, filteredCount }) {
  return (
    <header className="page-header">
      <p className="eyebrow">Week 12 React Assignment</p>
      <h1>Hawaii Island Cards</h1>
      <p className="intro">
        Data-driven cards with props, map, filter, and reduce.
      </p>
      <p className="status-line">
        Showing {filteredCount} of {totalCount} islands.
      </p>
    </header>
  );
}

export default Header;

