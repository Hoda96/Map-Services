import React, { useState, useContext, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../App.css";
import MapContext from "../context/MapContext";
import getRoute from "../api/getRoute";

const API_KEY = import.meta.env.VITE_API_KEY;
const SOURCE_ID = "route-layer";
const LAYER_ID = "route";

export default function FindRoute() {
  const mapRef = useContext(MapContext);
  // const markerRef = useRef(null);
  const [point, setPoint] = useState({ start: false, destination: false });
  const [coordinates, setCoordinates] = useState({
    startLng: null,
    startLat: null,
    destinationLng: null,
    destinationLat: null,
  });

  const [markers, setMarkers] = useState({
    start: null,
    destination: null,
  });

  function handlePoint(type) {
    if (markers[type]) {
      console.log("type", type);
      markers[type].remove();
    }

    setPoint((prev) => ({ ...prev, [type]: !prev[type] }));
    function add_marker(e) {
      console.log("e", e);
      const markerr = new maplibregl.Marker();
      console.log("e.lngLat", e.lngLat);
      const coords = e.lngLat;
      markerr.setLngLat(coords).addTo(mapRef.current);
      // markerRef.current = markerr;
      // Save the markerr in the state
      setMarkers((prevState) => ({
        ...prevState,
        [type]: markerr,
      }));
      console.log("markers:", markers);

      setCoordinates((prevState) => ({
        ...prevState,
        [`${type}Lng`]: coords.lng,
        [`${type}Lat`]: coords.lat,
      }));
      setPoint((prev) => ({ ...prev, [type]: !prev[type] }));
      mapRef.current.off("click", add_marker);
    }
    mapRef.current.on("click", add_marker);
  }

  async function handleFindRoute() {
    const allCoordsAreNotSet =
      coordinates.startLng === null ||
      coordinates.startLat === null ||
      coordinates.destinationLng === null ||
      coordinates.destinationLat === null;

    if (allCoordsAreNotSet) {
      console.log("Start or destination coordinates are not set");
      return;
    }

    // Route API
    const url = "https://map.ir/routes/foot/v1/driving/";
    const { startLng, startLat, destinationLng, destinationLat } = coordinates;

    const geometry = await getRoute({
      url,
      startLng,
      startLat,
      destinationLng,
      destinationLat,
    });

    console.log("Geometry:", geometry);

    if (!geometry) {
      console.log("Geometry is null");
      return;
    }

    const routeSource = mapRef.current?.getSource?.(SOURCE_ID);
    // Check if the route source already exists
    if (routeSource) {
      // Update the route source data with the new coordinates
      routeSource?.setData({
        type: "Feature",
        properties: {},
        geometry: geometry,
      });
    } else {
      // If the route source does not exist, add it
      mapRef.current.addSource(SOURCE_ID, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: geometry,
        },
      });
      // Add the route layer
      mapRef.current.addLayer({
        id: LAYER_ID,
        type: "line",
        source: SOURCE_ID,
        paint: {
          "line-color": "#eb4034", // Color of the route
          "line-width": 4, // Width of the route
        },
      });
    }
  }

  useEffect(() => {
    return () => {
      try {
        if (!mapRef.current) return;
        mapRef.current.getLayer(LAYER_ID) &&
          mapRef.current.removeLayer(LAYER_ID);
        mapRef.current.getSource(SOURCE_ID) &&
          mapRef.current.removeSource(SOURCE_ID);

        // markerRef.current["start"].remove();
      } catch (error) {
        console.log("Error:", error);
      }
    };
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <div className="groupBtn">
          <button
            className="btn"
            onClick={() => handlePoint("start")}
            style={{
              backgroundColor: point.start ? "#ccc1c0" : "",
              color: point.start ? "#f5f5f5" : "",
            }}
          >
            Starting Point
          </button>
          <button
            className="btn"
            onClick={() => handlePoint("destination")}
            style={{
              backgroundColor: point.destination ? "#ccc1c0" : "",
              color: point.destination ? "#f5f5f5" : "",
            }}
          >
            Destinaion Point
          </button>
          <button className="findBtn" onClick={handleFindRoute}>
            Find Route
          </button>
        </div>
      </div>
    </div>
  );
}
