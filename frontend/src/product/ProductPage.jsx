import React from "react";
import Navbar from "../components/Navbar";
import ProductGrid from "./ProductGrid";
import ProductBanner from "./ProductBanner";





export default function ProductPage() {
  return (
    <div className="bg-bg min-h-screen text-text">
      <Navbar />
      <ProductBanner />
      <ProductGrid />
    </div>
  );
}
