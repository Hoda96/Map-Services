import React, { useContext, useEffect, useState } from "react";
import MapContext from "../context/MapContext";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function Geofence() {
  const mapRef = useContext(MapContext);

  const [selectedFile, setSelectedFile] = useState();
  const [fileContent, setFileContent] = useState();
  const [stages, setStages] = useState({});
  //   console.log("isGeojsonAvailable", selectedFile);
  //   console.log("show geojson", fileContent);

  const handleFileChange = (event) => {
    // console.log("file uploaded:", event.target.files);
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
        console.log("File uploaded successfully:", data);
      } catch (error) {
        console.error("Failed to upload file:", error);
        return;
      }
    };
    // Read the file's content
    reader.readAsText(selectedFile);
  };

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
        console.log("data:", data);
        setStages(data);

        console.log("stages state", stages);
      } catch (error) {
        console.log("Failed to get stages", error);
      }
    };
    // Call the async function
    fetchStages();
    mapRef.current.addSource("stage", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: [
                [
                  [51.404460425546716, 35.74047460051801],
                  [51.3799245702744, 35.73431904610969],
                  [51.40988458850961, 35.709283211445694],
                  [51.42330683516079, 35.72674742302611],
                  [51.42663685406157, 35.74104946384466],
                  [51.404460425546716, 35.74047460051801],
                ],
              ],
              type: "Polygon",
            },
          },
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: [
                [
                  [51.401234799345815, 35.69826694278217],
                  [51.40057022054742, 35.68864772571267],
                  [51.419381349542306, 35.68751061718493],
                  [51.421420568591486, 35.69798176043251],
                  [51.401234799345815, 35.69826694278217],
                ],
              ],
              type: "Polygon",
            },
          },
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: [
                [
                  [51.33343572995875, 35.72843408428626],
                  [51.30861491012362, 35.728434467551295],
                  [51.30875814944605, 35.70636796480834],
                  [51.33343572995875, 35.72843408428626],
                ],
              ],
              type: "Polygon",
            },
          },
        ],
      },
    });

    mapRef.current.addLayer({
      id: "stage",
      type: "fill",
      source: "stage",
      paint: {
        "fill-color": "#0080ff", // blue color fill
        "fill-opacity": 0.5,
      },
    });
    // Add a black outline around the polygon.
    mapRef.current.addLayer({
      id: "outline",
      type: "line",
      source: "stage",
      layout: {},
      paint: {
        "line-color": "#000",
        "line-width": 1,
      },
    });
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <div className="uploadStage">
          <h2>Uploaded Stages</h2>
          <p>
            You have uploaded {stages && stages["odata.count"]} stages so far.
          </p>
          <div className="uploadBtn">
            <input type="file" onChange={handleFileChange} className="" />
            <button onClick={handleUpload} className="btn">
              Upload GeoJSON
            </button>
          </div>
          <div className="divider"></div>
          <div className="groupBtn">
            <button className="btn">Delete Stage</button>
          </div>
        </div>
        <div className="addCoords">
          <p>
            Select a point on the map or insert the coordinates to Verify its
            Location.
          </p>
        </div>
      </div>
    </div>
  );
}
