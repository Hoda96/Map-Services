import React, { useContext, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../App.css";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function AutoSearch() {
  const [search, setSearch] = useState(" ");

  function handleSearch(e) {
    e.preventDefault();
    setSearch(e.target.value);
    console.log("state", search);
  }

  async function submitSearch() {
    const url = "https://map.ir/search/v2/autocomplete";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${API_KEY}`,
      },
      body: `{"text":"${search}"}`,
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container">
      <div className="sidebar">
        <h3 style={{ textAlign: "left" }}>Search where?!</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="search here..."
            onChange={handleSearch}
          />
          <button
            type="submit"
            onClick={submitSearch}
            className="btn"
            style={{ marginBlock: "0.5rem" }}
          >
            Search
          </button>
          <h1>{search}</h1>
        </div>
      </div>
    </div>
  );
}
