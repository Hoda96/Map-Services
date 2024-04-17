import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Navbar({isClicked}) {
  return (
    <nav className="navbar">
      <Link className="navbar-item item-1" to={"FindRoute"} 
      // style={{
      //    backgroundColor: isClicked ? "#ccc1c0" : "",
      //    color: isClicked ? "#f5f5f5" : "",
      // }}
      
      >Find Route</Link>
      <Link className="navbar-item item-2" to={"NotFound"}>404</Link>
      <Link className="navbar-item item-3" to={"Geofence"}>Geofence</Link>
    </nav>
  );
}
