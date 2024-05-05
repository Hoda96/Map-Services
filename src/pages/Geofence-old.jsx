import React, { useContext, useState } from "react";
import MapContext from "../context/MapContext";

export default function Geofence() {
  const mapRef = useContext(MapContext);

  const [selectedFile, setSelectedFile] = useState();
  const [geoojson, setGeojson] = useState({});
  console.log("isGeojsonAvailable", selectedFile);
  console.log("show geojson", geoojson);

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

      //   return geojson;
      setGeojson(() => e.target.result);
    };
    // Read the file's content
    reader.readAsText(selectedFile);

    // Here you can add the code to upload 'selectedFile' to a server
    // alert(`File ${selectedFile.name} is ready to be uploaded.`);

    mapRef.current.addSource("stage", {
      type: "geojson",
      data:
      {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "coordinates": [
                  [
                    [
                      51.404460425546716,
                      35.74047460051801
                    ],
                    [
                      51.3799245702744,
                      35.73431904610969
                    ],
                    [
                      51.40988458850961,
                      35.709283211445694
                    ],
                    [
                      51.42330683516079,
                      35.72674742302611
                    ],
                    [
                      51.42663685406157,
                      35.74104946384466
                    ],
                    [
                      51.404460425546716,
                      35.74047460051801
                    ]
                  ]
                ],
                "type": "Polygon"
              }
            },
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "coordinates": [
                  [
                    [
                      51.401234799345815,
                      35.69826694278217
                    ],
                    [
                      51.40057022054742,
                      35.68864772571267
                    ],
                    [
                      51.419381349542306,
                      35.68751061718493
                    ],
                    [
                      51.421420568591486,
                      35.69798176043251
                    ],
                    [
                      51.401234799345815,
                      35.69826694278217
                    ]
                  ]
                ],
                "type": "Polygon"
              }
            },
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "coordinates": [
                  [
                    [
                      51.33343572995875,
                      35.72843408428626
                    ],
                    [
                      51.30861491012362,
                      35.728434467551295
                    ],
                    [
                      51.30875814944605,
                      35.70636796480834
                    ],
                    [
                      51.33343572995875,
                      35.72843408428626
                    ]
                  ]
                ],
                "type": "Polygon"
              }
            }
          ]
        }
      
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
