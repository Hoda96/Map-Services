import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
// import { router } from "./router";

import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import FindRoute from "./pages/FindRoute";
import NotFound from "./pages/NotFound";
import Geofence from "./pages/Geofence";
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
        path: "/Geofence",
        element: <Geofence />,
        errorElement: <NotFound />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
