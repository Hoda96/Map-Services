import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

export default function Navbar() {
  const [isClicked, setIsClicked] = useState(false);
  const location = useLocation();
  return (
    <nav className="navbar">
      <Link
        onClick={() => setIsClicked(!isClicked)}
        className={`navbar-item item-1 ${
          location.pathname === "/FindRoute" ? "active" : ""
        }`}
        to={"FindRoute"}
      >
        Find Route
      </Link>
      <Link
        className={`navbar-item item-2 ${
          location.pathname === "/Geofence" ? "active" : ""
        } `}
        to={"Geofence"}
        onClick={() => setIsClicked(!isClicked)}
      >
        Geofence
      </Link>
    </nav>
  );
}
