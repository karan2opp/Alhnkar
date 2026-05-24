// src/order/AddressForm.jsx

import { useEffect } from "react";
import { useProfileStore } from "../store/useProfileStore";

export default function AddressForm({ addressId, setAddressId }) {
  const { addresses, fetchUserAddresses } = useProfileStore();

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Select Address</h2>

      {addresses.length === 0 ? (
        <p className="text-sm text-text/50">No addresses found. Please add one from your profile.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <label key={address._id} className="block">
              <input
                type="radio"
                checked={addressId === address._id}
                onChange={() => setAddressId(address._id)}
              />
              <span className="ml-2">
                {address.street}, {address.city}, {address.state} - {address.pincode}
                {address.isDefault && (
                  <span className="ml-2 text-xs text-primary">(Default)</span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}