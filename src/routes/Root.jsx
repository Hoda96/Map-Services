import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {Outlet} from "react-router-dom";
import Navbar from "../layouts/Navbar";


const API_KEY = import.meta.env.VITE_API_KEY;

function Root() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const lng = 51.5;
  const lat = 35.72;
  const zoom = 12;

  const[isSidebarOpen, setIsSidebarOpen]= useState(false);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://map.ir/vector/styles/main/mapir-xyz-style.json", // stylesheet location
      center: [lng, lat], // starting position [lng, lat]
      zoom: zoom, // starting zoom
      transformRequest: (url) => {
        return {
          url,
          headers: {
            "x-api-key": API_KEY, //Map.ir api key
          },
        };
      },
    });
  }, []);


// function handleFeature(){
//   setIsSidebarOpen(!isSidebarOpen)
// }


  return (
    <div className="container">
      <Outlet/>
      <div
        ref={mapContainer}
        className="map-container"
        />
  
          <Navbar />
      {/* <button
        className="test"
        onClick={handleFeature}
        style={{
          backgroundColor: isClicked ? "#ccc1c0" : "",
          color: isClicked ? "#f5f5f5" : "",
        }}
      >
        Find Route
      </button> */}
      {/* {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} />} */}
    </div>
  );
}

export default Root;
