// CartPage.jsx

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

export default function CartPage() {
  const {
    cartItems,
    fetchUserCart,
    loading,
  } = useCartStore();


  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserCart();
    }
  }, [isLoggedIn]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-bg text-text min-h-screen px-4 md:px-10 py-10">
          <p>Loading cart...</p>
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

        <div className="grid md:grid-cols-3 gap-10">

          {/* Left - Items */}
          <div className="md:col-span-2 space-y-8">
            {cartItems?.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                />
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>

          {/* Right - Summary */}
          <div>
            <CartSummary cartItems={cartItems} />
          </div>
        </div>
      </div>
    </>
  );
}