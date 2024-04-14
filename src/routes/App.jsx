import React, { useRef, useEffect, useState } from "react";


export default function App({mapContainer}) {
 
  return (
    // <div>hi</div>
    <>
      <div className="container">
        <div className="sidebar">

        </div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </>
  );
}

