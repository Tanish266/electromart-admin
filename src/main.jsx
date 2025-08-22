import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AddProduct from "./components/AddProduct.jsx";
import ProductList from "./components/ProductList.jsx";
import Orderlist from "./components/Orderlist.jsx";
import Signup from "./components/Signup.jsx";
import SignIn from "./components/SignIn.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/Signup", element: <Signup /> },
  { path: "/SignIn", element: <SignIn /> },
  { path: "/add-product", element: <AddProduct /> },
  { path: "/dashboard", element: <App /> },
  { path: "/product-list", element: <ProductList /> },
  { path: "/order-list", element: <Orderlist /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
