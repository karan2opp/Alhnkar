export default function ShippingMethod() {
  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Shipping Method</h2>

      <div className="space-y-4">

        <div className="p-4 border border-primary/20 rounded flex justify-between items-center">
          <div>
            <p className="font-medium">Standard Delivery</p>
            <p className="text-sm text-text/60">3–5 days</p>
          </div>
          <span className="text-primary">Free</span>
        </div>

        <div className="p-4 border border-primary/20 rounded flex justify-between items-center">
          <div>
            <p className="font-medium">Express Delivery</p>
            <p className="text-sm text-text/60">Next day</p>
          </div>
          <span className="text-primary">₹45</span>
        </div>
      </div>
    </div>
  );
}