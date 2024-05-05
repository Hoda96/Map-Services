import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import MapContext from "../context/MapContext";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import checkIsPointInStage from "../api/geofence";
import cleanup from "../utils/cleanup";

const API_KEY = import.meta.env.VITE_API_KEY;

const SOURCE_ID = "geofence-polygons-source";
const LAYER_ID = "geofence-polygons-layer";

const marker = new maplibregl.Marker();

export default function Geofence() {
  const mapRef = useContext(MapContext);
  const [selectedFile, setSelectedFile] = useState();
  const [stages, setStages] = useState({});

  // 1. turn this into one state
  // 2. initialize value = null, it's null or number.
  const [coords, setCoords] = useState({ lng: " ", lat: " " });

  // 1. use useCallback (because you will need the same function reference when removing the listener)
  // 2. wrap event listener with useEffect
  // 3. add clean up func to useEffect
  // 3.1 move clean up from other useEffect to a better place!
  const add_marker = useCallback((e) => {
    const coordinates = e.lngLat;
    marker.setLngLat(coordinates).addTo(mapRef.current);
    // markerRef.current = marker;
    setCoords(coordinates);
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    // Create a new FileReader object
    let reader = new FileReader();

    // Setup the callback event to run when file reading is complete
    reader.onloadend = async (e) => {
      // Create a new FormData instance
      let formData = new FormData();
      console.log("formData:", formData);

      // Add the file to the FormData instance
      formData.append("polygons", selectedFile);

      // Make a POST request to the API endpoint
      try {
        const response = await fetch("https://map.ir/geofence/stages", {
          method: "POST",
          body: formData,
          headers: {
            "x-api-key": `${API_KEY}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("File uploaded successfully:", data);
      } catch (error) {
        console.error("Failed to upload file:", error);
        return;
      }
    };
    // Read the file's content
    reader.readAsText(selectedFile);
  };

  // Select point directly on map, not fields in sidebar
  useEffect(() => {
    // Make a GET request to the API
    const fetchStages = async () => {
      try {
        const response = await fetch("https://map.ir/geofence/stages", {
          headers: {
            "x-api-key": `${API_KEY}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data is ready now:", data);
        setStages(data);
        console.log("stage is updated now:", stages);
      } catch (error) {
        console.log("Failed to get stages", error);
      }
    };
    // Call the async function
    fetchStages();
  }, []);

  // add/remove Listener
  useEffect(() => {
    mapRef.current?.on("click", add_marker);

    return () => {
      mapRef.current?.off("click", add_marker);
    };
  }, []);

  // add marker to map after click on submit button
  async function handlePointSubmit() {
    if (!coords.lat || !coords.lng) return;

    const isPointInStage = await checkIsPointInStage({ coords });

    marker.setLngLat(coords).addTo(mapRef.current);

    if (isPointInStage) {
      alert("Yey, point is verified :)");
    } else {
      alert("No, Point is not verified :(");
    }
    setCoords({
      lng: " ",
      lat: " ",
    });
  }

  // update or add stages to map, then clear map of layers and sources in unmount(route change)
  useEffect(() => {
    if (!mapRef.current || !stages?.value?.length) return;

    const features = stages?.value?.map((st) => ({
      geometry: st.boundary,
      properties: {},
      type: "Feature",
    }));

    const featureCollection = {
      type: "FeatureCollection",
      features,
    };

    const source = mapRef.current?.getSource?.(SOURCE_ID);

    if (source) {
      console.log("featureCollection", featureCollection);
      // update
      source.setData({
        type: "geojson",
        data: featureCollection,
      });
    } else {
      // add
      mapRef.current.addSource(SOURCE_ID, {
        type: "geojson",
        data: featureCollection,
      });

      mapRef.current.addLayer({
        id: LAYER_ID,
        type: "fill",
        source: SOURCE_ID,
        paint: {
          "fill-color": "#0080ff", // blue color fill
          "fill-opacity": 0.5,
        },
      });
    }
    // clean up map
    return () => {
      cleanup(mapRef.current, SOURCE_ID, LAYER_ID, marker);
    };

    //   try {
    //     if (!mapRef.current) return;

    //     mapRef.current.getLayer(LAYER_ID) &&
    //       mapRef.current.removeLayer(LAYER_ID);
    //     mapRef.current.getSource(SOURCE_ID) &&
    //       mapRef.current.removeSource(SOURCE_ID);

    //     //Remove previous marker on double click
    //     // markerRef.current?.remove();
    //     console.log("marker length:", Object.keys(marker));
    //     marker?.remove();
    //   } catch (error) {
    //     console.log("Error:", error);
    //   }
    // };
  }, [stages, mapRef.current]);

  return (
    <div className="container">
      <div className="sidebar">
        {stages && stages["odata.count"] ? (
          <div className="uploadStage">
            <h2>Uploaded Stages</h2>
            <p>
              You have uploaded {stages && stages?.["odata.count"]} stages so
              far.
            </p>
          </div>
        ) : (
          <p>Loading</p>
        )}
        <div className="uploadBtn">
          <input type="file" onChange={handleFileChange} className="" />
          <button onClick={handleUpload} className="btn">
            Upload GeoJSON
          </button>
        </div>
        <div className="divider"></div>
        <div className="addCoords">
          <p style={{ lineHeight: "1.5rem", marginBottom: "2rem" }}>
            Select a point on the map or insert the coordinates to Verify its
            Location.
          </p>
          {/* <form action="submit" onSubmit={handlePointSubmit}> */}
          <div className="uploadBtn">
            <label htmlFor="latInput">Latitude: </label>
            <input
              type="text"
              name="lat"
              id="latInput"
              value={coords["lat"]}
              onChange={(e) => {
                setCoords((prev) => ({
                  ...prev,
                  lat: e.target.value,
                }));
                marker.setLngLat(coords).addTo(mapRef.current);
              }}
            />
          </div>
          <div className="uploadBtn">
            <label htmlFor="latInput">Longitude: </label>
            <input
              type="text"
              name="lng"
              id="lngInput"
              value={coords["lng"]}
              onChange={(e) => {
                setCoords((prev) => ({
                  ...prev,
                  lng: e.target.value,
                }));
                marker.setLngLat(coords).addTo(mapRef.current);
              }}
            />
          </div>
          <button className="btn" onClick={handlePointSubmit}>
            Verify Point
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
}
