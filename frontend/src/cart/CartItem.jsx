// src/components/cart/CartItem.jsx
import { Trash2, ShoppingBag, Eye } from "lucide-react"; // ✅ Added Eye icon
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/showToast";

export default function CartItem({ item }) {
  const { updateCartItem } = useCartStore();
  const navigate = useNavigate();

  // ✅ "Buy Now" - Pass exact structure CheckoutPage expects
  const handleBuyNow = () => {
    navigate("/order", { 
      state: { 
        product: item.product,
        size: item.size,
        quantity: item.quantity
      } 
    });
  };

  // ✅ NEW: "View Detail" - Navigate to product detail page
  const handleViewDetail = () => {
    navigate(`/productDetail/${item.product?._id}`);
  };

  // ✅ "Remove" - Use existing updateCart with action: "remove"
  const handleRemove = async () => {
    if (window.confirm("Remove this item from your cart?")) {
      try {
        await updateCartItem({
          productId: item.product?._id,
          size: item.size,
          action: "remove",
        });
        showToast.success("Item removed", "", 2000);
      } catch (error) {
        showToast.error("Failed to remove item", "", 3000);
        console.error("Remove error:", error);
      }
    }
  };

  return (
    <div className="flex gap-4 border-b border-primary/10 pb-6 last:border-0">
      
      {/* Image - ✅ Clickable to view detail */}
      <img
        src={item.product?.images?.[0]?.url || "/placeholder.jpg"}
        alt={item.product?.title}
        className="w-24 h-28 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-90 transition"
        onError={(e) => { e.target.src = "/placeholder.jpg"; }}
        onClick={handleViewDetail} // ✅ Click image to view detail
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* ✅ Product title clickable too */}
        <h3 
          className="font-medium text-text truncate cursor-pointer hover:text-primary transition"
          onClick={handleViewDetail}
        >
          {item.product?.title}
        </h3>
        <p className="text-sm text-text/60 mt-1">
          Size: <span className="font-medium text-text">{item.size}</span>
        </p>
        <p className="text-sm text-text/60">
          Qty: <span className="font-medium text-text">{item.quantity}</span>
        </p>
        <p className="text-[15px] font-medium text-accent mt-2">
          ₹{(item.product?.price * item.quantity).toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-between items-end gap-2">
        
        {/* ✅ Action Buttons Group */}
        <div className="flex flex-col gap-1.5">
          
          {/* Buy Now - Primary action */}
          <button
            onClick={handleBuyNow}
            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-bg text-[11px] font-medium rounded-lg hover:opacity-90 transition whitespace-nowrap"
          >
            <ShoppingBag size={14} />
            BUY NOW
          </button>

          {/* View Detail - Secondary action */}
          <button
  onClick={handleViewDetail}
            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-bg text-[11px] font-medium rounded-lg hover:opacity-90 transition whitespace-nowrap"

>
  <Eye size={14} />
  VIEW DETAILS
</button>
        </div>

        {/* Remove - Tertiary action (subtle) */}
        <button
          onClick={handleRemove}
          className="flex items-center gap-1 text-[11px] text-text/60 hover:text-[var(--color-accent)] transition"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>
    </div>
  );
}