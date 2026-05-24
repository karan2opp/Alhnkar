import { create } from "zustand";
import {
  fetchAddresses,
  addAddress,
  editAddress,
  removeAddress,
} from "../address/address.service"; // adjust path

export const useAddressStore = create((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  /* Fetch all addresses for logged-in user */
  fetchUserAddresses: () =>
    fetchAddresses(set),

  /* Create a new address */
  addUserAddress: (data) =>
    addAddress(set, get, data),

  /* Update an existing address */
  editUserAddress: (addressId, data) =>
    editAddress(set, get, addressId, data),

  /* Delete an address */
  removeUserAddress: (addressId) =>
    removeAddress(set, get, addressId),

  /* Clear on logout */
  clearAddresses: () =>
    set({ addresses: [], loading: false, error: null }),
}));