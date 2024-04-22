import { useEffect, useState } from "react";

export function useCleanMap(mapContainer) {
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const cleanMap = () => {


    if (!isMapInitialized || !mapContainer.current) return;

    const map = mapContainer.current.map; // Access map object using current
    console.log("Map layers:", map.getStyle().layers); // Log available layers
    console.log("Map sources:", map.getStyle().sources); // Log available sources
  

    // Remove all layers and sources added for the current route
    for (const layerId of map.getStyle().layers) {
      map.removeLayer(layerId);
    }
    for (const sourceId of map.getStyle().sources) {
      map.removeSource(sourceId);
    }
    // Reset any other map state specific to the current route

    setIsMapInitialized(false);
  };

  useEffect(() => {
    setIsMapInitialized(true);
  }, [mapContainer]);

  return { cleanMap };
}
