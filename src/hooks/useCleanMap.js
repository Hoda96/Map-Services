import { useContext, useEffect, useRef } from 'react';
import MapContext from '../context/MapContext';

export function useCleanMap(mapContainerRef) {
  const mapRef = useContext(MapContext)

  useEffect(() => {
    // Initialize map only once
    // if (!mapRef.current) {
    //   mapRef.current = new mapboxgl.Map({
    //     container: mapContainerRef.current,
    //     // ... your map initialization options
    //   });
    // }

    return () => {
      // Clean up map resources when the component unmounts
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapContainerRef]);

  const clearMap = () => {
    if (mapRef.current) {
      // Remove all sources and layers from the map
      mapRef.current.setStyle({ layers: [] });
      mapRef.current.removeSource('any-existing-source-id'); // Remove any existing sources
    }
  };

  return { mapRef, clearMap };
}
