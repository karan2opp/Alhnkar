export default function PaymentForm() {
  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Payment Details</h2>

      <div className="space-y-4">

        <input placeholder="Cardholder Name" className="input" />

        <input placeholder="Card Number" className="input" />

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="MM/YY" className="input" />
          <input placeholder="CVV" className="input" />
        </div>
      </div>
    </div>
  );
}