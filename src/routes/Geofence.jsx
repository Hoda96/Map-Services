import React, { useContext, useState } from "react";
import MapContext from "../context/MapContext";

export default function Geofence() {
  const mapRef = useContext(MapContext);

  const [selectedFile, setSelectedFile] = useState();

  const handleFileChange = (event) => {
    console.log("file uploaded:", event.target.files);
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      console.log("Please select a file first");
      return;
    }
    // Create a new FileReader object
    let reader = new FileReader();
    console.log("reader:", reader);

    // reader.onprogress = ()=> alert("file is prossesing")
    // Setup the callback event to run when file reading is complete
    reader.onloadend = (e) => {
      console.log("file", e.target.result);
      const geojson = e.target.result;
      return geojson;
    };
    // Read the file's content
    reader.readAsText(selectedFile);

    // Here you can add the code to upload 'selectedFile' to a server
    console.log(`File ${selectedFile.name} is ready to be uploaded.`);
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
