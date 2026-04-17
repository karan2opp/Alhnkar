import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import HomePage from "./home/HomePage";
import ProductCard from "./product/ProductCard";
import CartPage from "./cart/CartPage";
import CheckoutPage from "./order/CheckoutPage";

import Signup from "./auth/Signup";
import Login from "./auth/Login";
import ProductPage from "./product/ProductPage";
const router=createBrowserRouter([
  {
    path:"/",
    element:<HomePage />
  },
 {
  path: "/product",
  element: <ProductPage />
},
  {
    path:"/Cart",
    element:<CartPage />
  },
  {
    path:"/Order",
    element:<CheckoutPage />
  },
  {
    path:"/login",
    element:<Login />
  },
  {path:"/signup",
    element:<Signup />
  }
])
ReactDOM.createRoot(document.getElementById("root")).render(
 <RouterProvider router={router} />
);