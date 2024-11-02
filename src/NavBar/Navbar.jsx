import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navItems = ["Home", "Movies", "TV Series", "About"];
  const navPaths = ["", "movies", "series", "about"];
  const indicatorRef = useRef(null);
  const navItemsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const activeIndex = navPaths.indexOf(location.pathname.slice(1));

  useEffect(() => {
    const activeItem = navItemsRef.current[activeIndex];
    if (indicatorRef.current && activeItem) {
      indicatorRef.current.style.width = `${activeItem.offsetWidth}px`;
      indicatorRef.current.style.left = `${activeItem.offsetLeft}px`;
    }
  }, [activeIndex]);

  const handleClick = (index) => navigate(`/${navPaths[index]}`);

  return (
    <nav className="nav">
      <div className="nav-container">
        <a className="logo" href="">
          <img src="./TMIDB.png" alt="" />
        </a>
        <div className="nav-left">
          {navItems.map((item, index) => (
            <a
              key={index}
              ref={(el) => (navItemsRef.current[index] = el)}
              className={`nav-item ${index === activeIndex ? "active" : ""}`}
              onClick={() => handleClick(index)}
            >
              {item}
            </a>
          ))}
          <div ref={indicatorRef} className="nav-indicator"></div>
        </div>
        <div className="nav-right">
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                navigate(`/search/${e.target.value}`);
              }
            }}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
