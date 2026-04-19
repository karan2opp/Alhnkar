// CartSummary.jsx

export default function CartSummary({ cartItems }) {
  
  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      (item.product?.price || 0) * item.quantity,
    0
  );

  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-surface p-6 border border-primary/10 rounded-lg">

      <h2 className="text-lg font-medium mb-4">
        Summary
      </h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-primary/10 my-4"></div>

      <div className="flex justify-between font-medium mb-4">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      <button className="w-full bg-primary text-bg py-3 text-sm tracking-wide hover:opacity-90">
        PROCEED TO CHECKOUT
      </button>

      <div className="mt-4 text-xs text-text/60 space-y-1">
        <p>✔ Secure checkout</p>
        <p>✔ Free shipping</p>
      </div>
    </div>
  );
}