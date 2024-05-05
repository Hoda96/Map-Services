
export default function cleanup(mapRef,sourceId, layerId, marker) {
  

    try {
        if (!mapRef) return;

        mapRef.getLayer(layerId) &&
          mapRef.removeLayer(layerId);
        mapRef.getSource(sourceId) &&
          mapRef.removeSource(sourceId);

        //Remove previous marker on double click
        // markerRef?.remove();
        if(Object.keys(marker).length === 2 ){
            marker["start"].remove();
            marker["destination"].remove();
        }else
        marker?.remove();
      } catch (error) {
        console.log("Error:", error);
      }
}
