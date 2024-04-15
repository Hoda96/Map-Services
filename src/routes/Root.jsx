import React, {
  useRef
} from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import MapComponent from "../layouts/MapComponent";
import MapContext from "../context/MapContext";
import FindRoute from "./FindRoute";

function Root() {
  const mapRef = useRef(null);

  return (
    <MapContext.Provider value={mapRef}>
      <div className="container">
        <Outlet />

        {/* <div
        ref={mapContainer}
        className="map-container"
      /> */}
        <MapComponent />
        <Navbar />
      </div>
    </MapContext.Provider>
  );
}

export default Root;
