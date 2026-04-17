function Header({ currentView, onNavigate }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Maui Hospitality</h1>
        </div>
        <nav className="nav">
          <button
            type="button"
            className={`nav-link nav-button ${currentView === "marketing" ? "is-active" : ""}`}
            onClick={() => onNavigate("marketing")}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link nav-button ${currentView === "dashboard" ? "is-active" : ""}`}
            onClick={() => onNavigate("dashboard")}
          >
            View Dashboard
          </button>
          <span className="nav-status">Admin in Week 14</span>
        </nav>
      </div>
    </header>
  );
}

export default Header;
