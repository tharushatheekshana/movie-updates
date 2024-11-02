import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <nav className="footer-nav">
          <Link to="/" className="footer-link">
            Home
          </Link>
          <Link to="/movies" className="footer-link">
            Movies
          </Link>
          <Link to="/series" className="footer-link">
            TV Series
          </Link>
          <Link to="/about" className="footer-link">
            About Us
          </Link>
        </nav>
        <div className="footer-social">
          <h4 className="footer-heading">Connect With Us</h4>
          <img
            className="footer-social-icons"
            alt="Social Media Icons"
            src="/img/buttons-container.svg"
          />
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-info">
          <p className="footer-text">@2024 TMIDB, All Rights Reserved</p>
          <div className="footer-policies">
            <Link className="footer-policy-link">Terms of Use</Link>
            <Link className="footer-policy-link">Privacy Policy</Link>
            <Link className="footer-policy-link">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
