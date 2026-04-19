// CartItem.jsx

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { useCartStore } from "../store/useCartStore";

export default function CartItem({ item }) {
  const { updateCartItem } = useCartStore();

  const handleUpdateCart = (action) => {
    updateCartItem({
      productId: item.product?._id,
      size: item.size,
      action,
    });
  };

  return (
    <div className="flex gap-4 border-b border-primary/10 pb-6">

      {/* Image */}
      <img
        src={item.product?.images?.[0]?.url}
        alt={item.product?.title}
        className="w-24 h-28 object-cover rounded"
      />

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-medium">
          {item.product?.title}
        </h3>

        <p className="text-sm text-text/60">
          Size: {item.size}
        </p>

        <p className="text-sm text-text/60 mb-3">
          Quantity: {item.quantity}
        </p>

        {/* Quantity */}
        <div className="flex items-center gap-3">

          {/* Decrement */}
          <button
            onClick={() =>
              handleUpdateCart("decrement")
            }
            className="p-1 border border-primary/30"
          >
            <Minus size={14} />
          </button>

          <span>{item.quantity}</span>

          {/* Increment */}
          <button
            onClick={() =>
              handleUpdateCart("increment")
            }
            className="p-1 border border-primary/30"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Price + Remove */}
      <div className="flex flex-col justify-between items-end">
        <p className="text-sm font-medium">
          ₹{item.product?.price}
        </p>

        {/* Remove */}
        <button
          onClick={() =>
            handleUpdateCart("remove")
          }
          className="flex items-center gap-1 text-xs text-text/60 hover:text-accent"
        >
          <Trash2 size={14} />
          REMOVE
        </button>
      </div>
    </div>
  );
}