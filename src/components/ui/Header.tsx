import React from "react";
import { Link } from "react-router-dom";
import "../../HeaderFooter.css"; // updated path

const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo-section">
          <img src="/logo.png" alt="Twirly Tails Logo" className="logo-img" />
        </div>
        <nav className="nav-links">
          <Link to="/product">PRODUCT</Link>
          <Link to="/">HOME</Link>
          <Link to="/about">FEATURES</Link>
          <Link to="/contact">CONTACTS</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
