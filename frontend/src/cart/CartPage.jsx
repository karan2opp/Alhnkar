import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartPage() {
  return (
    <div className="bg-bg text-text min-h-screen px-4 md:px-10 py-10">

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-serif mb-8">
        Shopping Bag
      </h1>

      <div className="grid md:grid-cols-3 gap-10">

        {/* Left - Items */}
        <div className="md:col-span-2 space-y-8">
          <CartItem />
          <CartItem />
        </div>

        {/* Right - Summary */}
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}