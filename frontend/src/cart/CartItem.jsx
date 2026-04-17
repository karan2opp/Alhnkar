import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem() {
  return (
    <div className="flex gap-4 border-b border-primary/10 pb-6">

      {/* Image */}
      <img
        src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"
        className="w-24 h-28 object-cover rounded"
      />

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-medium">Silk Maxi Dress</h3>
        <p className="text-sm text-text/60">Color: Champagne Gold</p>
        <p className="text-sm text-text/60 mb-3">Size: Medium</p>

        {/* Quantity */}
        <div className="flex items-center gap-3">
          <button className="p-1 border border-primary/30">
            <Minus size={14} />
          </button>

          <span>1</span>

          <button className="p-1 border border-primary/30">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Price + Remove */}
      <div className="flex flex-col justify-between items-end">
        <p className="text-sm font-medium">₹420.00</p>

        <button className="flex items-center gap-1 text-xs text-text/60 hover:text-accent">
          <Trash2 size={14} />
          REMOVE
        </button>
      </div>
    </div>
  );
}