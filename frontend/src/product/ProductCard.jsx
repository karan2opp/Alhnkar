import { Heart } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

export default function ProductCard({ product }) {
  if (!product) return null;
const {addProductToCart}=useCartStore()
  return (
    <div className="bg-surface text-text rounded-lg overflow-hidden border border-primary/10 shadow-sm">

      <div className="flex flex-col md:grid md:grid-cols-2">

        {/* Image Section */}
        <div className="bg-bg flex items-center justify-center p-6">
          <img
            src={product.images[0].url}
            alt={product.title}
            className="w-full max-w-xs md:max-w-sm object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between">

          {/* Top Info */}
          <div>
            <p className="text-xs tracking-widest text-primary/70 mb-2">
              {product.description || "THE HERITAGE COLLECTION"}
            </p>

            <h2 className="text-2xl md:text-3xl font-serif mb-2">
              {product.title}
            </h2>

            <p className="text-lg text-primary mb-4">
              ₹{product.price}
            </p>

            <p className="text-sm text-text/70 mb-6">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="flex gap-3 mb-6">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="w-5 h-5 rounded-full border border-primary/30"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}

            {/* Sizes */}
           {product.variants?.length > 0 && (
  <div className="flex flex-wrap gap-3 mb-6">
    {product.variants.map((variant, index) => (
      <button
        key={index}
        disabled={variant.stock === 0}
        className={`px-4 py-2 border text-sm transition
          ${
            variant.stock === 0
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-primary/30 hover:bg-primary hover:text-bg"
          }
        `}
      >
        {variant.size}
      </button>
    ))}
  </div>
)}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">

            <button onClick={()=>addProductToCart(product._id)} className="bg-primary text-bg px-6 py-3 text-sm tracking-wide w-full sm:w-auto hover:opacity-90 transition">
              ADD TO BAG →
            </button>

            <button className="flex bg-accent px-6 py-3 items-center gap-2 text-sm text-bg hover:bg-accent/85">
              BUY IT NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}