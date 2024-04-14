import React, { useRef, useEffect, useState } from "react";

import {Outlet} from "react-router-dom";
import Navbar from "../layouts/Navbar";
import MapComponent from "../layouts/MapComponent";



function Root() {
  // const mapContainer = useRef(null);
  // const mapRef = useRef(null);
  // const lng = 51.5;
  // const lat = 35.72;
  // const zoom = 12;

  const[isSidebarOpen, setIsSidebarOpen]= useState(false);

  // useEffect(() => {
  //   if (mapRef.current) return;

  //   mapRef.current = new maplibregl.Map({
  //     container: mapContainer.current,
  //     style: "https://map.ir/vector/styles/main/mapir-xyz-style.json", // stylesheet location
  //     center: [lng, lat], // starting position [lng, lat]
  //     zoom: zoom, // starting zoom
  //     transformRequest: (url) => {
  //       return {
  //         url,
  //         headers: {
  //           "x-api-key": API_KEY, //Map.ir api key
  //         },
  //       };
  //     },
  //   });
  // }, []);


// function handleFeature(){
//   setIsSidebarOpen(!isSidebarOpen)
// }


  return (
    <div className="container">
      <Outlet/>
      {/* <div
        ref={mapContainer}
        className="map-container"
        /> */}
        <MapComponent/>
          <Navbar />
    </div>
  );
}

export default Root;
