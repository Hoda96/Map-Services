import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import FindRoute from "./pages/FindRoute";
import NotFound from "./pages/NotFound";
import Geofence from "./pages/Geofence";



 export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/FindRoute",
        element: <FindRoute />,
        errorElement: <NotFound />,
      },
      {
        path: "/Geofence",
        element: <Geofence />,
        errorElement: <NotFound />,
      },
    ],
  },
]);

