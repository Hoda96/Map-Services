import React, { useRef, useEffect, useState, useContext } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../App.css";
import MapContext from "../context/MapContext";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function FindRoute() {
  const mapRef = useContext(MapContext);

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
      const marker = new maplibregl.Marker();
      console.log("e.lngLat", e.lngLat);
      const coords = e.lngLat;
      marker.setLngLat(coords).addTo(mapRef.current);

      // Save the marker in the state
      setMarkers((prevState) => ({
        ...prevState,
        [type]: marker,
      }));

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

    const geometry = await getRoute();

    console.log("Geometry:", geometry);

    if (!geometry) {
      console.log("Geometry is null");
      return;
    }

    const routeSource = mapRef.current.getSource("route");
    // Check if the route source already exists
    if (routeSource) {
      // Update the route source data with the new coordinates
      routeSource.setData({
        type: "Feature",
        properties: {},
        geometry: geometry,
      });
    } else {
      // If the route source does not exist, add it
      mapRef.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: geometry,
        },
      });

      // Add the route layer
      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#eb4034", // Color of the route
          "line-width": 4, // Width of the route
        },
      });
    }
  }

  const getRoute = async () => {
    try {
      const res = await fetch(
        `https://map.ir/routes/foot/v1/driving/${coordinates.startLng},${coordinates.startLat};${coordinates.destinationLng},${coordinates.destinationLat}?alternatives=true&steps=true&geometries=geojson`,
        // `https://map.ir/routes/route/v1/driving/51.421047,35.732936;51.422185,35.731821`,
        // `https://map.ir/routes/route/v1/driving/51.421047,35.732936;51.422185,35.731821?alternatives=true&steps=true&geometries=geojson`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
          method: "GET",
        }
      );

      if (!res.ok) throw new Error(" Fetch not completed :(");

      const data = await res.json();

      const geometry = data.routes[0].geometry;

      console.log("geometryyyy", geometry);
      // setGeometry(geometry);
      return geometry;
    } catch (error) {
      return null;
    }
  };

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
