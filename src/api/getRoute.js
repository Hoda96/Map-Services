const API_KEY = import.meta.env.VITE_API_KEY;


const getRoute = async ({url,startLng,startLat,destinationLng, destinationLat}) => {
  try {
    const res = await fetch(
      `${url}${startLng},${startLat};${destinationLng},${destinationLat}?alternatives=true&steps=true&geometries=geojson`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
        method: "GET",
      }
    );

    if (!res.ok) throw new Error(" Fetch not completed :(");

    const data = await res.json();

    const geometry = data.routes[0].geometry;

    return geometry;
  } catch (error) {
    return null;
  }
};

export default getRoute;

