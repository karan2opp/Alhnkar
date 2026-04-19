// src/order/OrderSummary.jsx

export default function OrderSummary({
  product,
  quantity,
  onPlaceOrder,
}) {
  const subtotal =
    product.price * quantity;

  const shipping = 0;
  const tax = subtotal * 0.08;
  const total =
    subtotal + shipping + tax;

  return (
    <div className="bg-surface p-6 rounded-lg border border-primary/10">
      <h2 className="text-lg font-medium mb-6">
        Order Summary
      </h2>

      <div className="flex gap-4 mb-6">
        <img
          src={product.images[0]?.url}
          className="w-16 h-20 object-cover rounded"
        />

        <div>
          <p>{product.title}</p>
          <p>Qty: {quantity}</p>
        </div>

        <span>
          ₹{product.price}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total</span>
          <span>
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        className="w-full bg-primary text-bg py-3 mt-6"
      >
        PLACE ORDER
      </button>
    </div>
  );
}