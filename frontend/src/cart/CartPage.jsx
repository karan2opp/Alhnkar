// src/pages/cart/CartPage.jsx
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import CartItem from "./CartItem";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { showToast } from "../utils/showToast";

export default function CartPage() {
  const { cartItems, fetchUserCart, loading, error } = useCartStore();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserCart();
    }
  }, [isLoggedIn, fetchUserCart]);

  // ✅ Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      showToast.error(error, "Cart Error", 4000);
    }
  }, [error]);

  if (loading && cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="bg-bg text-text min-h-screen px-4 md:px-10 py-20 flex items-center justify-center">
          <p className="text-text/60">Loading your cart...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-bg text-text min-h-screen px-4 md:px-10 py-10">
        
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-serif mb-8">
          Shopping Bag
        </h1>

        {/* Cart Items */}
        <div className="max-w-3xl">
          {cartItems?.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-text/60 mb-4">Your cart is empty</p>
              <button
                onClick={() => window.history.back()}
                className="text-[var(--color-primary)] hover:underline text-sm"
              >
                ← Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}