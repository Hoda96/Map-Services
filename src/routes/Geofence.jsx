import React, { useContext, useState } from "react";
import MapContext from "../context/MapContext";

export default function Geofence() {
  const mapRef = useContext(MapContext);

  const [selectedFile, setSelectedFile] = useState();
  const [geojson, setGeojson] = useState({});
  console.log("isGeojsonAvailable", selectedFile);
  console.log("show geojson", geojson);

  const handleFileChange = (event) => {
    console.log("file uploaded:", event.target.files);
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    // Create a new FileReader object
    let reader = new FileReader();
    console.log("reader:", reader);

    // Setup the callback event to run when file reading is complete
    reader.onloadend = (e) => {
      console.log("file", e.target.result);
      //   const geojson = e.target.result;
      //   return geojson;
      setGeojson(() => e.target.result);
    };
    // Read the file's content
    reader.readAsText(selectedFile);

    // Here you can add the code to upload 'selectedFile' to a server
    // alert(`File ${selectedFile.name} is ready to be uploaded.`);
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
