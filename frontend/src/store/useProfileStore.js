// src/store/useProfileStore.js

import { create } from "zustand";

import {
  getProfile,
  updateProfile,
  createAddress,
  fetchAddresses,
  updateAddress,
  deleteAddress,
} from "../profile/profile.service";

export const useProfileStore = create(
  (set) => ({
    userProfile: null,
    addresses: [],
    loading: false,
    error: null,

    fetchUserProfile: () =>
      getProfile(set),

    updateUserProfile: (payload) =>
      updateProfile(set, payload),

    addNewAddress: (payload) =>
      createAddress(set, payload),

    fetchUserAddresses: () =>
      fetchAddresses(set),

    updateUserAddress: (
      addressId,
      payload
    ) =>
      updateAddress(
        set,
        addressId,
        payload
      ),

    deleteUserAddress: (addressId) =>
      deleteAddress(set, addressId),

    clearProfile: () =>
      set({
        userProfile: null,
        addresses: [],
        loading: false,
        error: null,
      }),
  })
);