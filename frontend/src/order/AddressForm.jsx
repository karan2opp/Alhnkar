export default function AddressForm() {
  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Shipping Address</h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input placeholder="First Name" className="input" />
        <input placeholder="Last Name" className="input" />

        <input
          placeholder="House number and street name"
          className="input md:col-span-2"
        />

        <input placeholder="City" className="input" />
        <input placeholder="Pincode" className="input" />
      </div>
    </div>
  );
}