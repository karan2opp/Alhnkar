import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MyOrdersPage from "./order/MyOrderPage";
import App from "./App";
import HomePage from "./home/HomePage";
import CartPage from "./cart/CartPage";
import CheckoutPage from "./order/CheckoutPage";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import ProductPage from "./product/ProductPage";
import ProductDetailPage from "./product/ProductDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/product",
    element: <ProductPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/order",
    element: <CheckoutPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/productDetail/:id",
    element: <ProductDetailPage />,
  },
  {
  path: "/my-orders",
  element: <MyOrdersPage />
}
]);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
 
    <App>
      <RouterProvider router={router} />
    </App>
  
);