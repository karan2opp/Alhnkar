import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import  { Toaster } from 'react-hot-toast';
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
import ProfilePage from "./profile/ProfilePage";
import SearchPage from "./product/SearchPage";
import CategoryPage from "./category/CategoryPage";
import Admin from "./admin/Admin";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword"
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
},{
  path:"profile",
  element:<ProfilePage/>
},
{
  path: "/search",
  element: <SearchPage />
},
{
  path:"/category",
  element:<CategoryPage />
},
{
  path:"/admin",
  element:<Admin />
},{
  path:"/forgot-password",
  element:<ForgotPassword />
},
{
  path:"/reset-password/:token",
  element:<ResetPassword />
}
]);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
 
    <App>
      <Toaster />
      <RouterProvider router={router} />
    </App>
  
);