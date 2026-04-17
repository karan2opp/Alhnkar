import AddressForm from "./AddressForm";
import ShippingMethod from "./ShippingMethod";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";

export default function CheckoutPage() {
  return (
    <div className="bg-bg text-text min-h-screen px-4 md:px-10 py-10">

      {/* Title */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-serif">
          Finalizing Beauty
        </h1>
        <p className="text-sm text-text/60">
          Review your selection and provide delivery details.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Left */}
        <div className="lg:col-span-2 space-y-10">
          <AddressForm />
          <ShippingMethod />
          <PaymentForm />
        </div>

        {/* Right */}
        <OrderSummary />
      </div>
    </div>
  );
}