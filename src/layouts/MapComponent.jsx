import React, {  useContext, useEffect, useRef } from 'react'
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapContext from '../context/MapContext';



const API_KEY = import.meta.env.VITE_API_KEY;



export default function MapComponent() {  
  const mapContainer = useRef(null);
  // const mapRef = useRef(null);
  const mapRef = useContext(MapContext);
  const lng = 51.5;
  const lat = 35.72;
  const zoom = 12;
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
      }, [API_KEY, mapRef]);
    
  return (
    <div
        ref={mapContainer}
        className="map-container"
        />
  )
}
