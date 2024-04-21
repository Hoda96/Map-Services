import React, { useContext, useEffect, useState } from "react";
import MapContext from "../context/MapContext";

const API_KEY = import.meta.env.VITE_API_KEY;

// const stage = uploadStages({})
// if (stage) {
//   fetchAndSetStages()
// }

export default function Geofence() {
  const mapRef = useContext(MapContext);

  const [selectedFile, setSelectedFile] = useState();
  const [fileContent, setFileContent] = useState();
  const [stages, setStages] = useState({});
  const [processedData, setProcessedData] = useState([]);

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

        // // Extract boundary values to display polygons on map
        // const geometryValue = data.value.map((item) => item.boundary);
        // console.log("geometryValue", typeof geometryValue);

        // const geojsonBoundaries = geometryValue.map((boundary) => ({
        //   type: "Polygon",
        //   coordinates: boundary,
        //   properties: {},
        // }));

        console.log("final geojson", geojsonBoundaries);
        console.log("stages state", stages);
      } catch (error) {
        console.log("Failed to get stages", error);
      }
    };
    // Call the async function
    fetchStages();
  }, []);

  // Extract boundary values to display polygons on map
  const geometryValue = stages?.value?.map((item) => item.boundary);
  console.log("geometryValue", geometryValue);

  const geojsonBoundaries = geometryValue?.map((boundary) => ({
    geometry: boundary,
    properties: {},
  }));

  console.log("geojsonFeatureCollection", geojsonBoundaries);
  // const count = internalData?.["odata.count"]; // undefined | number

  // can use useMemo with a dependency array of internalData for performance benefits
  // const geojson = internalData?.value.map(); // create geojson feature collection (undefined | FeatureCollection)

  // useEffect(() => {
  if (!stages || !mapRef.current) return;

  const geojsonFeatureCollection = {
    type: "FeatureCollection",
    features: geojsonBoundaries,
  };

  console.log("geojsonFeatureCollection", geojsonFeatureCollection);

  // mapRef.current.addSource("geofence-polygons", {
  //   type: "geojson",
  //   data: geojsonFeatureCollection,
  // });

  if (!mapRef.current.getSource("geofence-polygons")) {
    // console.log(
    //   "debug",
    //   geojsonFeatureCollection && geojsonFeatureCollection.features.length > 0
    // );
    if (
      geojsonFeatureCollection &&
      geojsonFeatureCollection.features.length > 0
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
      mapRef.current.addLayer({
        id: "outline",
        type: "line",
        source: "geofence-polygons",
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 1,
        },
      });
    } else {
      console.log(
        "geojsonFeatureCollection not yet available for adding source."
      );
    }
  }

  // }, [stages, geojsonFeatureCollection]);

  // useEffect(() => {
  //   // Check if data object exists (assuming it's fetched or passed as props)
  //   if (stages) {
  //     const geometryValue = {};
  //     console.log("stagggg", stages);
  //     // const values = stages["value"];
  //     for (const item of stages.value) {
  //       geometryValue[item.id] = item.boundary;
  //     }
  //     console.log("geometryValue", geometryValue);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (stages) {
  //     console.log("ggggggg", stages["value"]); // To check the result
  //     const boundaryObj = stages["value"];
  //     console.log(boundaryObj);
  //     {
  //       Object.entries(boundaryObj).map(([index, { boundary }]) =>
  //         console.log("boundary", boundary)
  //       );
  //     }
  //   }
  // }, [stages]);

  // useEffect(() => {
  //   // Add source and layer only if mapRef is initialized and fileContent is available
  //   if (mapRef.current && fileContent) {
  //     try {
  //       mapRef.current.addSource("uploadedPolygons", {
  //         type: "geojson",
  //         data: JSON.parse(fileContent),
  //       });

  //       mapRef.current.addLayer({
  //         id: "polygonLayer",
  //         type: "fill",
  //         source: "uploadedPolygons",
  //         paint: {
  //           "fill-color": "#0080ff", // Blue color fill
  //           "fill-opacity": 0.5,
  //         },
  //       });
  //     } catch (error) {
  //       console.error("Failed to add source or layer:", error);
  //     }
  //   }
  // }, [fileContent, mapRef]);

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
