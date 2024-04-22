import React, { useContext, useEffect, useState } from "react";
import MapContext from "../context/MapContext";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function Geofence() {
  const mapRef = useContext(MapContext);

  const [selectedFile, setSelectedFile] = useState();
  const [fileContent, setFileContent] = useState();
  const [stages, setStages] = useState({});

  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);

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
      // Set the file content to the state
      setFileContent(e.target.result);

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
        // setStages(...stages, data.value);
        // fetchAndSetStages();
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

  // Select point directly on map, not fields in sidebar
  // Mark location on map by clicking on map
  function add_marker2(e) {
    const marker = new maplibregl.Marker();
    console.log("e.lngLat", e.lngLat);
    const { lng, lat } = e.lngLat;
    marker.setLngLat({ lng, lat }).addTo(mapRef.current);
    setLng(lng);
    setLat(lat);
  }
  mapRef.current?.on("click", add_marker2);

  // Check if location is in a stage or not
  useEffect(() => {
    const checkBoundary = async () => {
      const url = `https://map.ir/geofence/boundaries?lat=${lat}&lon=${lng}`;
      const options = {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
        },
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status !== "404") {
          alert("Yey, point is verified :)");
        } else return;
      } catch (error) {
        console.error(error);
      }
    };
    if (lat && lng) {
      checkBoundary();
    }
  }, [lat, lng]);

  // Extract boundary values to display polygons on map
  const geometryValue = stages?.value?.map((item) => item.boundary);
  console.log("geometryValue", geometryValue);

  const geojsonBoundaries = geometryValue?.map((boundary) => ({
    geometry: boundary,
    properties: {},
  }));

  if (!stages || !mapRef.current) return;

  const geojsonFeatureCollection = {
    type: "FeatureCollection",
    features: geojsonBoundaries,
  };

  if (!mapRef.current.getSource("geofence-polygons")) {
    if (
      geojsonFeatureCollection &&
      geojsonFeatureCollection?.features?.length > 0
    ) {
      // Check if geojsonFeatureCollection has a value
      mapRef.current.addSource("geofence-polygons", {
        type: "geojson",
        data: geojsonFeatureCollection,
      });
      mapRef.current.addLayer({
        id: "geofence-polygons-id",
        type: "fill",
        source: "geofence-polygons",
        paint: {
          "fill-color": "#0080ff", // blue color fill
          "fill-opacity": 0.5,
        },
      });
      // Add a black outline around the polygon.
      // mapRef.current.addLayer({
      //   id: "outline",
      //   type: "line",
      //   source: "geofence-polygons",
      //   layout: {},
      //   paint: {
      //     "line-color": "#000",
      //     "line-width": 1,
      //   },
      // });
    }
  } else {
    console.log(
      "geojsonFeatureCollection not yet available for adding source."
    );
  }

  // if (lat && lng) {
  //   const userSelectedLocation = [lng, lat]; // Assuming selectedLocation is an array with [lon, lat]
  //   console.log("userSelectedLocation", userSelectedLocation);
  //   const url = new URL(
  //     "https://map.ir/geofence/boundaries",
  //     window.location.origin
  //   );
  //   console.log("url", url);
  //   url.searchParams.append("lat", userSelectedLocation[1]); // Latitude goes first
  //   url.searchParams.append("lon", userSelectedLocation[0]); // Longitude follows
  // }

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
            <input type="text" name="lat" id="latInput" />
          </div>
          <div className="uploadBtn">
            <label htmlFor="latInput">Longitude: </label>
            <input type="text" name="lng" id="lngInput" />
          </div>
          <button className="btn">Verify Point</button>
          {/* </form> */}
        </div>
      </div>
    </div>
    // </div>
  );
}
