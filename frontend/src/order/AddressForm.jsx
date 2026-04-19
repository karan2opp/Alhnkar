// src/order/AddressForm.jsx

export default function AddressForm({
  addressId,
  setAddressId,
}) {
  /*
    Temporary hardcoded address

    Later connect with Address Module
  */

  const addresses = [
    {
      _id: "address123",
      label:
        "Home - Kurukshetra, Haryana",
    },
    {
      _id: "address456",
      label:
        "Office - Pehowa, Haryana",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium mb-6">
        Select Address
      </h2>

      <div className="space-y-4">
        {addresses.map((address) => (
          <label
            key={address._id}
            className="block"
          >
            <input
              type="radio"
              checked={
                addressId === address._id
              }
              onChange={() =>
                setAddressId(address._id)
              }
            />

            <span className="ml-2">
              {address.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}