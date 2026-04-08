function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Maui Hospitality</h1>
        </div>
        <nav className="nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#admin" className="nav-link">Admin</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
