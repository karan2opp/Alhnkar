// src/order/PaymentForm.jsx

export default function PaymentForm({
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-6">
        Payment Method
      </h2>

      <div className="space-y-4">
        {["cod", "upi", "card"].map(
          (method) => (
            <label
              key={method}
              className="block"
            >
              <input
                type="radio"
                checked={
                  paymentMethod === method
                }
                onChange={() =>
                  setPaymentMethod(method)
                }
              />

              <span className="ml-2 uppercase">
                {method}
              </span>
            </label>
          )
        )}
      </div>
    </div>
  );
}