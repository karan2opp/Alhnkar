export default function OrderSummary() {
  return (
    <div className="bg-surface p-6 rounded-lg border border-primary/10 h-fit">

      <h2 className="text-lg font-medium mb-6">Order Summary</h2>

      {/* Items */}
      <div className="space-y-4 mb-6">

        <div className="flex gap-4">
          <img
            src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"
            className="w-16 h-20 object-cover rounded"
          />
          <div className="flex-1 text-sm">
            <p>Ethereal Silk Trench</p>
            <p className="text-text/60">Qty: 1</p>
          </div>
          <span>₹1250</span>
        </div>

      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹2140</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹0</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹171</span>
        </div>
      </div>

      <div className="border-t border-primary/10 my-4"></div>

      <div className="flex justify-between font-medium mb-4">
        <span>Total</span>
        <span>₹2311</span>
      </div>

      <button className="w-full bg-primary text-bg py-3 text-sm tracking-wide hover:opacity-90">
        PLACE ORDER
      </button>
    </div>
  );
}