import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root.jsx";
import NotFound from "./routes/NotFound.jsx";
import FindRoute from "./routes/FindRoute.jsx";
import Geofence from "./routes/Geofence.jsx";

const router = createBrowserRouter([
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
        path:"/Geofence",
        element: <Geofence/>,
        errorElement:<NotFound/>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
