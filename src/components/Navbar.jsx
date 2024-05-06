import React from "react";
import "../App.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink
        activeclassname="active"
        className={"navbar-item item-2"}
        to={"Geofence"}
      >
        Geofence
      </NavLink>{" "}
      <NavLink
        activeclassname="active"
        className={"navbar-item item-1 "}
        to={"FindRoute"}
      >
        find Route
      </NavLink>
      <NavLink
        activeclassname="active"
        className={"navbar-item item-3 "}
        to={"Autosearch"}
      >
        Search
      </NavLink>{" "}
    </nav>
  );
}
