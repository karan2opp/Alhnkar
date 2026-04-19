import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";

export default function ProductDetailCard({ id }) {
  const { fetchProductById, selectedProduct } = useProductStore();
  const { addProductToCart, loading } = useCartStore();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id]);

  if (!id) return null;

  if (!selectedProduct) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  const validateSelection = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!validateSelection()) return;

    await addProductToCart({
      productId: selectedProduct._id,
      quantity: 1,
      size: selectedSize,
    });

    alert("Product added to cart");
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    navigate("/order", {
      state: {
        product: selectedProduct,
        size: selectedSize,
        quantity: 1,
      },
    });
  };
return (
    <div className="bg-surface text-text rounded-lg overflow-hidden border border-primary/10 shadow-sm">
      <div className="flex flex-col md:grid md:grid-cols-2">
        <div className="bg-bg flex items-center justify-center p-6">
          <img
            src={selectedProduct.images[0]?.url}
            alt={selectedProduct.title}
            className="w-full max-w-xs md:max-w-sm object-contain"
          />
        </div>

        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-serif mb-2">
            {selectedProduct.title}
          </h2>

          <p className="text-lg text-primary mb-4">
            ₹{selectedProduct.price}
          </p>

          <p className="text-sm text-text/70 mb-6">
            {selectedProduct.description}
          </p>
            <div className="flex flex-wrap gap-3 mb-6">
            {selectedProduct.variants?.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(variant.size)}
                disabled={variant.stock === 0}
                className={`px-4 py-2 border text-sm transition
                  ${
                    selectedSize === variant.size
                      ? "bg-primary text-bg border-primary"
                      : variant.stock === 0
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-primary/30 hover:bg-primary hover:text-bg"
                  }
                `}
              >
                {variant.size}
              </button>
            ))}
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="bg-primary text-bg px-6 py-3 hover:opacity-90 transition"
            >
              {loading ? "ADDING..." : "ADD TO BAG"}
            </button>
             <button
              onClick={handleBuyNow}
              className="bg-accent text-bg px-6 py-3 hover:opacity-90 transition"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}