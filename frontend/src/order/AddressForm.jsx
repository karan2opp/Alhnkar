import { useEffect, useState } from "react";
import { useProfileStore } from "../store/useProfileStore";

export default function AddressForm({
  addressId,
  setAddressId,
  deliveryAddress,
  setDeliveryAddress,
}) {
  const { addresses, fetchUserAddresses } = useProfileStore();

  const [useNewAddress, setUseNewAddress] = useState(false);

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const handleChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-xl border p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          Delivery Address
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select a saved address or enter a new one.
        </p>
      </div>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Saved Addresses
          </label>

          <select
            value={addressId}
            onChange={(e) => {
              setAddressId(e.target.value);
              setUseNewAddress(false);
            }}
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="">Choose an address</option>

            {addresses.map((address) => (
              <option
                key={address._id}
                value={address._id}
              >
                {address.street}, {address.city},{" "}
                {address.state} - {address.pincode}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-sm text-gray-400">OR</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      {/* Add New Address */}
      <div>
        <button
          type="button"
          onClick={() => {
            setUseNewAddress(!useNewAddress);
            setAddressId("");
          }}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          {useNewAddress
            ? "Hide Address Form"
            : "Enter New Address"}
        </button>
      </div>

      {useNewAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">
              Street Address
            </label>

            <input
              type="text"
              name="street"
              value={deliveryAddress.street}
              onChange={handleChange}
              placeholder="House No, Street, Area"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              City
            </label>

            <input
              type="text"
              name="city"
              value={deliveryAddress.city}
              onChange={handleChange}
              placeholder="Kurukshetra"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              State
            </label>

            <input
              type="text"
              name="state"
              value={deliveryAddress.state}
              onChange={handleChange}
              placeholder="Haryana"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              value={deliveryAddress.pincode}
              onChange={handleChange}
              placeholder="136128"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>
      )}
    </div>
  );
}