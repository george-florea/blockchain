import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GeneralLayout from "./layout/GeneralLayout";
import HomePage from "./Pages/Home/HomePage";
import AuctionsList from "./Pages/Auctions/AuctionsList";
import AddAuction from "./Pages/Auctions/AddAuction";
import ViewAuction from "./Pages/Auctions/ViewAuction";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/auctions",
        children: [
          {
            path: "/auctions",
            element: <AuctionsList />,
          },
          {
            path: "/auctions/add",
            element: <AddAuction />,
          },
          {
            path: "/auctions/:id",
            element: <ViewAuction />,
          },
        ],
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router}></RouterProvider>;
