import React, { useRef, useEffect, useState, useContext } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../App.css";
import MapComponent from "../layouts/MapComponent";
import MapContext from "../context/MapContext";


const API_KEY = import.meta.env.VITE_API_KEY;

if (maplibregl.getRTLTextPluginStatus !== "loaded") {
  maplibregl.setRTLTextPlugin(
    "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js"
  );
}

export default function FindRoute() {


  const mapRef = useContext(MapContext);
console.log("mapRef in findroute com", mapRef)

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
    console.log(' HHEEEEEEEEEEEEE LOOOOOOOOOOOOOOO')
    console.log('mapRef.current', mapRef)

    if (markers[type]) {
      markers[type].remove();
    }

    setPoint((prev) => ({ ...prev, [type]: !prev[type] }));
    function add_marker(e) {
      const marker = new maplibregl.Marker();
      console.log(e.lngLat);
      const coords = e.lngLat;
      marker.setLngLat(coords).addTo(mapRef);

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
      mapRef.off("click", add_marker);
    }
    mapRef.on("click", add_marker);
  }

  function handleFindRoute() {
    const allCoordsAreNotSet =
      coordinates.startLng === null ||
      coordinates.startLat === null ||
      coordinates.destinationLng === null ||
      coordinates.destinationLat === null;

    if (allCoordsAreNotSet) {
      console.log("Start or destination coordinates are not set");
      return;
    }

    // Check if the route source already exists
    if (mapRef.getSource("route")) {
      // Update the route source data with the new coordinates
      mapRef.getSource("route").setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [coordinates.startLng, coordinates.startLat], // Origin coordinates
            [coordinates.destinationLng, coordinates.destinationLat], // Destination coordinates
          ],
        },
      });
    } else {
      // If the route source does not exist, add it
      mapRef.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [coordinates.startLng, coordinates.startLat], // Origin coordinates
              [coordinates.destinationLng, coordinates.destinationLat], // Destination coordinates
            ],
          },
        },
      });

      // Add the route layer
      mapRef.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#325ca8", // Color of the route
          "line-width": 8, // Width of the route
        },
      });
    }
  }

  const getRoute = async () => {
    try {
      const req = await fetch(
        `https://map.ir/routes/foot/v1/driving/${startLng},${startLat};${destinationLng},${destinationLat}?alternatives=true&?steps=true&geometries=geojson`,
        // `https://map.ir/routes/route/v1/driving/51.421047,35.732936;51.422185,35.731821`,
        // `https://map.ir/routes/route/v1/driving/51.421047,35.732936;51.422185,35.731821?alternatives=true&steps=true&geometries=geojson`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
          method: "GET",
        }
      );

      if (!req.ok) throw new Error(" Fetch not completed :(");

      const route = await req.json();
      console.log("route", route);
    } catch (error) {
      console.log("Error:", error);
    }
  };

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
  //           "x-api-key": API_KEY, //Mapir api key
  //         },
  //       };
  //     },
  //   });
  // }, []);

  return (
 
      <div className="container">
        <div className="sidebar">
          <div className="groupBtn">
            <button
              className="btn"
              id="point"
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
              id="point"
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
       <MapComponent/>
      </div>

  );
}