const API_KEY = import.meta.env.VITE_API_KEY;


const checkIsPointInStage = async ({coords}) => {
    const url = `https://map.ir/geofence/boundaries?lat=${coords["lat"]}&lon=${coords["lng"]}`;
    const options = {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("checkispoin data", data);
      return data.value.length > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  export default checkIsPointInStage;