import React, { useContext, useState } from "react";
import MapContext from "../context/MapContext";

const API_KEY = import.meta.env.VITE_API_KEY;
// console.log(API_KEY);
export default function Geofence() {
  //   const mapRef = useContext(MapContext);

  const [selectedFile, setSelectedFile] = useState();
  const [fileContent, setFileContent] = useState();
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

  return (
    <div className="container">
      <div className="sidebar">
        <div className="groupBtn">
          <label className="title">Upload geojson file</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="uploadBtn"
          />
          <button onClick={handleUpload} className="btn">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
