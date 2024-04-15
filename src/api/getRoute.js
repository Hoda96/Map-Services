
// const API_KEY = import.meta.env.VITE_API_KEY;

// export const getRoute = async (url) => {
//     try {
//       const req = await fetch(
//         `https://map.ir/routes/foot/v1/driving/${startLng},${startLat};${destinationLng},${destinationLat}?alternatives=true&?steps=true&geometries=geojson`,
//         // `https://map.ir/routes/route/v1/driving/51.421047,35.732936;51.422185,35.731821`,
//         // `https://map.ir/routes/route/v1/driving/51.421047,35.732936;51.422185,35.731821?alternatives=true&steps=true&geometries=geojson`,
//         {
//           headers: {
//             "x-api-key": API_KEY,
//           },
//           method: "GET",
//         }
//       );

//       if (!req.ok) throw new Error(" Fetch not completed :(");

//       const route = await req.json();
//       console.log("rodfsdrgdfgfgute", route);
//     } catch (error) {
//       console.log("Error:", error);
//     }

//   };



const API_KEY = import.meta.env.VITE_API_KEY;


export async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    const data = await response.json(); // Parse JSON response
    console.log(data);
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors appropriately (e.g., display error message to user)
  }
}


// export const getRoute = async (url) => {
//     try {
//       const req = await fetch(url,
//         {
//           headers: {
//             "x-api-key": API_KEY,
//           },
//           method: "GET",
//         }
//       );

//       if (!req.ok) throw new Error(" Fetch not completed :(");

//       const route = await req.json();
//       console.log("route", route);
//       return route;
//     } catch (error) {
//       console.log("Error:", error);
//     }

//   };
