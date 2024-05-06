import maplibregl from "maplibre-gl";
import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import MapContext from "../context/MapContext";
import MapComponent from "../components/MapComponent";
import Navbar from "../components/Navbar";

import "maplibre-gl/dist/maplibre-gl.css";

if (maplibregl.getRTLTextPluginStatus !== "loaded") {
  maplibregl.setRTLTextPlugin(
    "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js"
  );
}

function Root() {
  const mapRef = useRef(null);

  return (
    <MapContext.Provider value={mapRef}>
      <div className="container">
        <Outlet />
        <MapComponent />
        <Navbar />
      </div>
    </MapContext.Provider>
  );
}

export default Root;
