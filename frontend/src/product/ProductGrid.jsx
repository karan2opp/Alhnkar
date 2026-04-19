import ProductCard from "./ProductCard";
import { useProductStore } from "../store/useProductStore";
import { useEffect,useState } from "react";

export default function ProductGrid() {
   
     const {fetchProducts,products}=useProductStore()
  useEffect(() => {
  fetchProducts();
}, []);
     
  return (
    <section className="px-4 md:px-8 lg:px-12 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.35em] text-primary/70 uppercase mb-3">
          Latest Collection
        </p>

        <h2 className="text-4xl md:text-5xl font-serif text-accent mb-4">
          Discover Our Signature Pieces
        </h2>

        <p className="text-text/70 max-w-xl mx-auto">
          Crafted with heritage, designed for modern elegance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button className="bg-primary text-bg px-10 py-4 rounded-md text-sm tracking-wide hover:opacity-90 transition">
          VIEW ALL PRODUCTS
        </button>
      </div>
    </section>
  );
}